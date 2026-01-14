import React, { useEffect, useState, useCallback } from "react";
import {
  RefreshControl,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Layout } from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
import {
  getClubById,
  getUserInfo,
  getUserBookings,
  getUserSubscription,
  getUserEventRegistrations,
  getUserPrivateClasses,
  getEvents,
  getPlatformSectionsById,
  Booking,
  Event as ApiEvent,
  PrivateClass,
  Club,
} from "../../store/effects";
import { AppDispatch } from "../../store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationProp,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator/AppNavigator";
import { Ionicons } from "@expo/vector-icons";
import { selectUserInfo } from "../../store/selectors";

// Extended Club type with feature flags (overriding Club's boolean)
interface ClubWithFeatures extends Omit<Club, "has_subscriptions"> {
  has_events?: number | boolean;
  has_classes?: number | boolean;
  has_subscriptions?: number | boolean;
}

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch: AppDispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [club, setClub] = useState<ClubWithFeatures | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<ApiEvent[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<PrivateClass[]>([]);
  const [allEvents, setAllEvents] = useState<ApiEvent[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [todayEvents, setTodayEvents] = useState<ApiEvent[]>([]);
  const [todayClasses, setTodayClasses] = useState<PrivateClass[]>([]);

  const fetchAllData = async (force: boolean = false) => {
    try {
      // Avoid refetching if data is fresh (less than 30 seconds old)
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTime;
      if (!force && timeSinceLastFetch < 30000 && lastFetchTime > 0) {
        console.log("[HomeScreen] Data is fresh, skipping fetch");
        return;
      }

      const storedUserId = await AsyncStorage.getItem("id_platforms_user");
      if (!storedUserId) return;

      const numUserId = Number(storedUserId);
      setUserId(numUserId);
      console.log("[HomeScreen] Fetching data for user:", numUserId);

      // Fetch all data in parallel for better performance
      const [
        userInfoResult,
        sectionsResult,
        clubResponse,
        userSub,
        bookingsResponse,
        eventsResponse,
        classesResponse,
        allEventsResponse,
      ] = await Promise.all([
        dispatch(getUserInfo(numUserId)),
        dispatch(getPlatformSectionsById(1)),
        dispatch(getClubById(1)),
        dispatch(getUserSubscription(numUserId)).catch((err) => {
          console.log("[HomeScreen] No subscription found:", err);
          return null;
        }),
        dispatch(getUserBookings(numUserId, 1)),
        dispatch(getUserEventRegistrations(numUserId)),
        dispatch(getUserPrivateClasses(numUserId)),
        dispatch(getEvents(1)),
      ]);

      // The Redux thunk returns the club data directly (not wrapped in payload or data)
      console.log("[HomeScreen] ========== CLUB DATA DEBUG ==========");
      const clubData = clubResponse as any;
      console.log(
        "[HomeScreen] Club data extracted:",
        clubData ? "SUCCESS" : "FAILED"
      );
      if (clubData) {
        console.log("[HomeScreen] Club ID:", clubData.id);
        console.log("[HomeScreen] Club name:", clubData.name);
        console.log(
          "[HomeScreen] Club has_events:",
          clubData.has_events,
          "(type:",
          typeof clubData.has_events,
          ")"
        );
        console.log(
          "[HomeScreen] Club has_classes:",
          clubData.has_classes,
          "(type:",
          typeof clubData.has_classes,
          ")"
        );
        console.log(
          "[HomeScreen] Club has_subscriptions:",
          clubData.has_subscriptions,
          "(type:",
          typeof clubData.has_subscriptions,
          ")"
        );
      } else {
        console.log(
          "[HomeScreen] ❌ Failed to extract club data from response"
        );
        console.log(
          "[HomeScreen] Full response:",
          JSON.stringify(clubResponse, null, 2)
        );
      }
      console.log("[HomeScreen] =====================================");
      setClub(clubData);

      console.log(
        "[HomeScreen] User subscription RAW:",
        JSON.stringify(userSub, null, 2)
      );
      console.log("[HomeScreen] Subscription status:", userSub?.status);
      console.log(
        "[HomeScreen] Subscription subscription:",
        userSub?.subscription
      );
      console.log(
        "[HomeScreen] Has active subscription:",
        userSub?.status === "active"
      );
      setSubscription(userSub);

      console.log("[HomeScreen] Bookings response:", bookingsResponse);
      console.log(
        "[HomeScreen] First booking court_name:",
        bookingsResponse?.[0]?.court_name
      );
      const upcoming = bookingsResponse?.filter(
        (b: Booking) =>
          new Date(b.booking_date) >= new Date() && b.status !== "cancelled"
      );
      console.log("[HomeScreen] Upcoming bookings:", upcoming);
      console.log("[HomeScreen] First upcoming booking:", upcoming?.[0]);
      setUpcomingBookings(upcoming || []);

      console.log("[HomeScreen] Events response:", eventsResponse);
      // API returns flat structure with event fields directly
      const upcomingUserEvents = eventsResponse?.filter(
        (e: any) => e.event_date && new Date(e.event_date) >= new Date()
      );
      console.log("[HomeScreen] Upcoming events:", upcomingUserEvents);
      setUpcomingEvents(upcomingUserEvents || []);

      console.log("[HomeScreen] Classes response:", classesResponse);
      const upcomingUserClasses = classesResponse?.filter(
        (c: PrivateClass) =>
          new Date(c.class_date) >= new Date() && c.status !== "cancelled"
      );
      console.log("[HomeScreen] Upcoming classes:", upcomingUserClasses);
      setUpcomingClasses(upcomingUserClasses || []);

      console.log("[HomeScreen] All events response:", allEventsResponse);
      const openEvents = allEventsResponse?.filter(
        (e: ApiEvent) =>
          e.status === "open" && new Date(e.event_date) >= new Date()
      );
      console.log("[HomeScreen] Open events:", openEvents);
      setAllEvents(openEvents || []);

      // Filter today's events from ALL user registrations (not just upcoming)
      // This avoids timezone issues where events later today might be filtered out
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // API returns flat structure - event fields are directly on the object
      const userEventsToday =
        eventsResponse?.filter((e: any) => {
          if (!e.event_date) return false;
          const eventDate = new Date(e.event_date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === today.getTime();
        }) || [];

      console.log("[HomeScreen] Today's events:", userEventsToday);
      setTodayEvents(userEventsToday);

      // Filter today's classes
      const userClassesToday =
        upcomingUserClasses?.filter((c: PrivateClass) => {
          const classDate = new Date(c.class_date);
          classDate.setHours(0, 0, 0, 0);
          return classDate.getTime() === today.getTime();
        }) || [];

      console.log("[HomeScreen] Today's classes:", userClassesToday);
      setTodayClasses(userClassesToday);

      setLastFetchTime(Date.now());
      setLoading(false);
    } catch (error) {
      console.error("Failed to load home screen data", error);
      setLoading(false);
    }
  };

  // Only fetch on first mount, not on every re-render
  useEffect(() => {
    fetchAllData(true);
  }, []);

  // Refetch when screen comes into focus, but respect the cache
  useFocusEffect(
    useCallback(() => {
      fetchAllData(false);
    }, [lastFetchTime])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllData(true); // Force refresh on pull-to-refresh
    setRefreshing(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    return `${hours}:${minutes}`;
  };

  // Get next upcoming activity (booking, event, or class)
  type Activity =
    | { type: "booking"; date: string; time: string; data: Booking }
    | { type: "event"; date: string; time: string; data: ApiEvent }
    | { type: "class"; date: string; time: string; data: PrivateClass };

  const getNextActivity = (): Activity | undefined => {
    const allActivities: Activity[] = [
      ...upcomingBookings.map(
        (b): Activity => ({
          type: "booking",
          date: b.booking_date,
          time: b.start_time,
          data: b,
        })
      ),
      ...upcomingEvents.map(
        (e): Activity => ({
          type: "event",
          date: e.event_date,
          time: e.start_time,
          data: e,
        })
      ),
      ...upcomingClasses.map(
        (c): Activity => ({
          type: "class",
          date: c.class_date,
          time: c.start_time,
          data: c,
        })
      ),
    ].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    return allActivities[0];
  };

  const nextActivity = getNextActivity();

  // Helper function to check if feature is enabled (handles both boolean and number values)
  const isFeatureEnabled = (value: number | boolean | undefined): boolean => {
    return value === true || value === 1;
  };

  // Quick action cards
  const quickActionsRaw = [
    {
      id: "book",
      title: "Reservar Cancha",
      icon: "tennisball",
      color: "#8c8a1a",
      onPress: () => navigation.navigate("Schedule", { bookingType: "court" }),
      visible: true, // Always show reservations
    },
    {
      id: "events",
      title: "Eventos",
      icon: "trophy",
      color: "#8c8a1a",
      onPress: () => navigation.navigate("Schedule", { bookingType: "court" }),
      visible: isFeatureEnabled(club?.has_events),
    },
    {
      id: "classes",
      title: "Clases",
      icon: "school",
      color: "#8c8a1a",
      onPress: () => navigation.navigate("Main", { screen: "Clases" }),
      visible: isFeatureEnabled(club?.has_classes),
    },
  ];

  console.log("[HomeScreen] ========== QUICK ACTIONS DEBUG ==========");
  console.log("[HomeScreen] Club state:", club);
  console.log(
    "[HomeScreen] club?.has_events:",
    club?.has_events,
    "(type:",
    typeof club?.has_events,
    ")"
  );
  console.log(
    "[HomeScreen] club?.has_classes:",
    club?.has_classes,
    "(type:",
    typeof club?.has_classes,
    ")"
  );
  console.log(
    "[HomeScreen] isFeatureEnabled(club?.has_events):",
    isFeatureEnabled(club?.has_events)
  );
  console.log(
    "[HomeScreen] isFeatureEnabled(club?.has_classes):",
    isFeatureEnabled(club?.has_classes)
  );
  quickActionsRaw.forEach((action) => {
    console.log(
      `[HomeScreen] Action "${action.title}" - visible: ${action.visible}`
    );
  });

  const quickActions = quickActionsRaw.filter((action) => action.visible);
  console.log("[HomeScreen] Filtered quickActions count:", quickActions.length);
  console.log(
    "[HomeScreen] Filtered quickActions:",
    quickActions.map((a) => a.title)
  );
  console.log("[HomeScreen] =======================================");

  if (loading) {
    return (
      <Layout style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola,</Text>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>
                {userInfo?.info?.full_name || "Usuario"}
              </Text>
              {subscription?.status === "active" && (
                <Text style={styles.crownIcon}>👑</Text>
              )}
            </View>
            {subscription?.status === "active" && (
              <Text style={styles.membershipLabel}>
                {subscription?.subscription?.name ||
                  subscription?.name ||
                  "Miembro Activo"}
              </Text>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acceso Rápido</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { borderColor: action.color }]}
                onPress={action.onPress}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: action.color },
                  ]}
                >
                  <Ionicons
                    name={action.icon as any}
                    size={28}
                    color="#ffffff"
                  />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today's Event Card */}
        {todayEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evento de Hoy</Text>
            {todayEvents.map((event, index) => (
              <TouchableOpacity
                key={`today-event-${event.id || index}`}
                style={styles.todayCard}
              >
                <View style={styles.todayCardHeader}>
                  <View
                    style={[
                      styles.todayCardIcon,
                      { backgroundColor: "#8c8a1a" },
                    ]}
                  >
                    <Ionicons name="trophy" size={28} color="#ffffff" />
                  </View>
                  <View style={styles.todayCardInfo}>
                    <Text style={styles.todayCardTitle}>{event.title}</Text>
                    <Text style={styles.todayCardSubtitle}>
                      {formatTime(event.start_time)} -{" "}
                      {formatTime(event.end_time)}
                    </Text>
                  </View>
                </View>
                {event.description && (
                  <Text style={styles.todayCardDescription} numberOfLines={2}>
                    {event.description}
                  </Text>
                )}
                <View style={styles.todayCardBadge}>
                  <Text style={styles.todayCardBadgeText}>¡Hoy!</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Today's Class Card */}
        {todayClasses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Clase de Hoy</Text>
            {todayClasses.map((privateClass, index) => (
              <TouchableOpacity
                key={`today-class-${privateClass.id || index}`}
                style={styles.todayCard}
              >
                <View style={styles.todayCardHeader}>
                  <View
                    style={[
                      styles.todayCardIcon,
                      { backgroundColor: "#e1dd2a" },
                    ]}
                  >
                    <Ionicons name="school" size={28} color="#ffffff" />
                  </View>
                  <View style={styles.todayCardInfo}>
                    <Text style={styles.todayCardTitle}>
                      Clase{" "}
                      {privateClass.class_type === "individual"
                        ? "Individual"
                        : privateClass.class_type === "group"
                        ? "Grupal"
                        : "Semi-Privada"}
                    </Text>
                    <Text style={styles.todayCardSubtitle}>
                      {formatTime(privateClass.start_time)} -{" "}
                      {formatTime(privateClass.end_time)}
                    </Text>
                  </View>
                </View>
                <View style={styles.todayCardBadge}>
                  <Text style={styles.todayCardBadgeText}>¡Hoy!</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Active Subscription */}
        {subscription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tu Membresía</Text>
            <TouchableOpacity style={styles.subscriptionCard}>
              <View style={styles.subscriptionHeader}>
                <Ionicons name="card" size={24} color="#e1dd2a" />
                {/* <View style={styles.subscriptionBadge}>
                  <Text style={styles.subscriptionBadgeText}>
                    {subscription.status === "active"
                      ? "ACTIVA"
                      : subscription.status?.toUpperCase() || "N/A"}
                  </Text>
                </View> */}
              </View>
              <Text style={styles.subscriptionName}>
                {subscription?.subscription?.name ||
                  subscription?.name ||
                  "Membresía"}
              </Text>
              <View style={styles.subscriptionDetails}>
                <View style={styles.subscriptionStat}>
                  <Text style={styles.subscriptionStatLabel}>Descuento</Text>
                  <Text style={styles.subscriptionStatValue}>
                    {subscription?.subscription?.booking_discount_percent ||
                      subscription?.booking_discount_percent ||
                      "0"}
                    %
                  </Text>
                </View>
                <View style={styles.subscriptionStat}>
                  <Text style={styles.subscriptionStatLabel}>Precio</Text>
                  <Text style={styles.subscriptionStatValue}>
                    $
                    {parseFloat(
                      subscription?.subscription?.price_monthly ||
                        subscription?.price_monthly ||
                        "0"
                    ).toFixed(2)}{" "}
                    {subscription?.subscription?.currency ||
                      subscription?.currency ||
                      "MXN"}
                  </Text>
                </View>
              </View>
              {(subscription?.subscription?.description ||
                subscription?.description) && (
                <Text style={styles.subscriptionDescription}>
                  {subscription?.subscription?.description ||
                    subscription?.description}
                </Text>
              )}
              {/* Show extras if available */}
              {(subscription?.subscription?.extras || subscription?.extras)
                ?.length > 0 && (
                <View style={styles.subscriptionExtras}>
                  <Text style={styles.subscriptionExtrasTitle}>
                    Beneficios adicionales:
                  </Text>
                  {(
                    subscription?.subscription?.extras || subscription?.extras
                  ).map((extra: any, index: number) => (
                    <Text
                      key={`extra-${index}-${
                        typeof extra === "string"
                          ? extra.substring(0, 10)
                          : extra.description?.substring(0, 10)
                      }`}
                      style={styles.subscriptionExtraItem}
                    >
                      • {typeof extra === "string" ? extra : extra.description}
                    </Text>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Next Activity */}
        {nextActivity && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próxima Actividad</Text>
            <TouchableOpacity style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View
                  style={[
                    styles.activityIconContainer,
                    {
                      backgroundColor:
                        nextActivity.type === "booking"
                          ? "#8c8a1a"
                          : nextActivity.type === "event"
                          ? "#8c8a1a"
                          : "#8c8a1a",
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      nextActivity.type === "booking"
                        ? "tennisball"
                        : nextActivity.type === "event"
                        ? "trophy"
                        : "school"
                    }
                    size={24}
                    color="#ffffff"
                  />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityType}>
                    {nextActivity.type === "booking"
                      ? "Reserva de Cancha"
                      : nextActivity.type === "event"
                      ? "Evento"
                      : "Clase Privada"}
                  </Text>
                  <Text style={styles.activityTitle}>
                    {nextActivity.type === "booking"
                      ? nextActivity.data.court_name || "Cancha"
                      : nextActivity.type === "event"
                      ? nextActivity.data.title
                      : `Clase ${nextActivity.data.class_type}`}
                  </Text>
                </View>
              </View>
              <View style={styles.activityDetails}>
                <View style={styles.activityDetail}>
                  <Ionicons name="calendar-outline" size={18} color="#6b7280" />
                  <Text style={styles.activityDetailText}>
                    {formatDate(nextActivity.date)}
                  </Text>
                </View>
                <View style={styles.activityDetail}>
                  <Ionicons name="time-outline" size={18} color="#6b7280" />
                  <Text style={styles.activityDetailText}>
                    {formatTime(nextActivity.time)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Upcoming Bookings Summary */}
        {upcomingBookings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mis Reservas</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Reservations")}
              >
                <Text style={styles.seeAllText}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            {upcomingBookings.slice(0, 3).map((booking, index) => (
              <View
                key={`booking-${booking.id || index}`}
                style={styles.miniCard}
              >
                <View style={styles.miniCardLeft}>
                  <Ionicons name="tennisball" size={20} color="#e1dd2a" />
                  <View style={styles.miniCardInfo}>
                    <Text style={styles.miniCardTitle}>
                      {booking.court_name || "Cancha"}
                    </Text>
                    <Text style={styles.miniCardSubtitle}>
                      {formatDate(booking.booking_date)} •{" "}
                      {formatTime(booking.start_time)}
                    </Text>
                  </View>
                </View>
                <View style={styles.miniCardBadge}>
                  <Text style={styles.miniCardBadgeText}>
                    {booking.status === "confirmed"
                      ? "Confirmada"
                      : booking.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Available Events */}
        {allEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Eventos Disponibles</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Main")}>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            {allEvents.slice(0, 3).map((event, index) => (
              <TouchableOpacity
                key={`event-${event.id || index}`}
                style={styles.eventCard}
              >
                <View style={styles.eventBadge}>
                  <Text style={styles.eventBadgeText}>
                    {event.event_type === "tournament"
                      ? "Torneo"
                      : event.event_type === "clinic"
                      ? "Clínica"
                      : "Evento"}
                  </Text>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventDetails}>
                  <View style={styles.eventDetail}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="#6b7280"
                    />
                    <Text style={styles.eventDetailText}>
                      {formatDate(event.event_date)}
                    </Text>
                  </View>
                  <View style={styles.eventDetail}>
                    <Ionicons name="people-outline" size={16} color="#6b7280" />
                    <Text style={styles.eventDetailText}>
                      {event.current_participants}
                      {event.max_participants
                        ? `/${event.max_participants}`
                        : ""}
                    </Text>
                  </View>
                  <View style={styles.eventDetail}>
                    <Ionicons name="cash-outline" size={16} color="#6b7280" />
                    <Text style={styles.eventDetailText}>
                      ${(event.registration_fee || 0).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* No activities message */}
        {!nextActivity &&
          upcomingBookings.length === 0 &&
          upcomingEvents.length === 0 &&
          upcomingClasses.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyStateTitle}>
                No tienes actividades próximas
              </Text>
              <Text style={styles.emptyStateText}>
                ¡Reserva una cancha o únete a un evento para comenzar!
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate("Reservations")}
              >
                <Text style={styles.primaryButtonText}>Reservar Ahora</Text>
              </TouchableOpacity>
            </View>
          )}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#9ca3af",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#111827",
  },
  greeting: {
    fontSize: 16,
    color: "#9ca3af",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  profileButton: {
    padding: 8,
  },
  clubBanner: {
    backgroundColor: "#111827",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  clubInfo: {
    flexDirection: "column",
  },
  clubName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  clubRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#9ca3af",
    marginLeft: 8,
  },
  section: {
    padding: 20,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: "#e1dd2a",
    fontWeight: "600",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },
  subscriptionCard: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#e1dd2a",
  },
  subscriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subscriptionBadge: {
    backgroundColor: "#831843",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subscriptionBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fce7f3",
  },
  subscriptionName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  subscriptionDetails: {
    flexDirection: "row",
  },
  subscriptionStat: {
    flex: 1,
  },
  subscriptionStatLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
  subscriptionStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subscriptionDescription: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 12,
    lineHeight: 20,
  },
  subscriptionExtras: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  subscriptionExtrasTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#d1d5db",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  subscriptionExtraItem: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 4,
  },
  activityCard: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityType: {
    fontSize: 12,
    color: "#9ca3af",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  activityDetails: {
    flexDirection: "row",
  },
  activityDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  activityDetailText: {
    fontSize: 14,
    color: "#9ca3af",
    marginLeft: 4,
  },
  miniCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  miniCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  miniCardInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  miniCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  miniCardSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
  },
  miniCardBadge: {
    backgroundColor: "#374151",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  miniCardBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#d1d5db",
  },
  eventCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  eventBadge: {
    backgroundColor: "#5b21b6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  eventBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ede9fe",
    textTransform: "uppercase",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
  eventDetails: {
    flexDirection: "row",
  },
  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  eventDetailText: {
    fontSize: 13,
    color: "#9ca3af",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#8c8a1a",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#8c8a1a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  todayCard: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#8c8a1a",
    position: "relative",
  },
  todayCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  todayCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  todayCardInfo: {
    flex: 1,
  },
  todayCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  todayCardSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
  },
  todayCardDescription: {
    fontSize: 14,
    color: "#d1d5db",
    lineHeight: 20,
    marginBottom: 12,
  },
  todayCardBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#8c8a1a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  todayCardBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  crownIcon: {
    fontSize: 24,
    marginLeft: 8,
  },
  membershipLabel: {
    fontSize: 12,
    color: "#fbbf24",
    marginTop: 4,
  },
});
