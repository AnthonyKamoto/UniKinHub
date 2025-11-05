import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../config/api_config.dart';

// Fonction pour gérer les notifications en arrière-plan
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  print('Background message: ${message.messageId}');
  print('Title: ${message.notification?.title}');
  print('Body: ${message.notification?.body}');
  print('Data: ${message.data}');
}

class NotificationService {
  static NotificationService? _instance;
  static NotificationService get instance =>
      _instance ??= NotificationService._();

  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  String? _fcmToken;

  NotificationService._();

  factory NotificationService() => instance;

  /// Initialise Firebase Cloud Messaging et les notifications locales
  Future<void> initialize() async {
    print("NotificationService: Initializing Firebase...");

    try {
      // Demander la permission pour les notifications
      NotificationSettings settings = await _firebaseMessaging
          .requestPermission(
            alert: true,
            badge: true,
            sound: true,
            provisional: false,
          );

      if (settings.authorizationStatus == AuthorizationStatus.authorized) {
        print('User granted permission');
      } else if (settings.authorizationStatus ==
          AuthorizationStatus.provisional) {
        print('User granted provisional permission');
      } else {
        print('User declined or has not accepted permission');
        return;
      }

      // Configurer les notifications locales
      const AndroidInitializationSettings initializationSettingsAndroid =
          AndroidInitializationSettings('@mipmap/ic_launcher');

      const DarwinInitializationSettings initializationSettingsIOS =
          DarwinInitializationSettings(
            requestAlertPermission: true,
            requestBadgePermission: true,
            requestSoundPermission: true,
          );

      const InitializationSettings initializationSettings =
          InitializationSettings(
            android: initializationSettingsAndroid,
            iOS: initializationSettingsIOS,
          );

      await _flutterLocalNotificationsPlugin.initialize(
        initializationSettings,
        onDidReceiveNotificationResponse: _onNotificationTap,
      );

      // Créer un canal de notification pour Android
      const AndroidNotificationChannel channel = AndroidNotificationChannel(
        'high_importance_channel',
        'Notifications Importantes',
        description: 'Canal pour les notifications importantes',
        importance: Importance.high,
      );

      await _flutterLocalNotificationsPlugin
          .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin
          >()
          ?.createNotificationChannel(channel);

      // Obtenir le token FCM
      _fcmToken = await _firebaseMessaging.getToken();
      if (_fcmToken != null) {
        print('FCM Token: $_fcmToken');
        // Le token sera envoyé au serveur après la connexion
      }

      // Rafraîchir le token si nécessaire
      _firebaseMessaging.onTokenRefresh.listen((newToken) {
        print('FCM Token refreshed: $newToken');
        _fcmToken = newToken;
        _sendTokenToServer(newToken);
      });

      // Gérer les notifications en arrière-plan
      FirebaseMessaging.onBackgroundMessage(
        _firebaseMessagingBackgroundHandler,
      );

      // Gérer les notifications au premier plan
      FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

      // Gérer les clics sur les notifications
      FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationClick);

      // Vérifier si l'app a été ouverte depuis une notification
      RemoteMessage? initialMessage = await _firebaseMessaging
          .getInitialMessage();
      if (initialMessage != null) {
        _handleNotificationClick(initialMessage);
      }

      print("NotificationService: Firebase initialized successfully");
    } catch (e) {
      print("NotificationService: Error initializing - $e");
    }
  }

  /// Envoie le token FCM au serveur
  Future<void> _sendTokenToServer(String token) async {
    try {
      final authToken = await ApiConfig.getAuthToken();
      if (authToken == null) {
        print('No auth token available, token will be sent after login');
        return;
      }

      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/fcm/register/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $authToken',
        },
        body: jsonEncode({'fcm_token': token}),
      );

      if (response.statusCode == 200) {
        print('FCM token sent to server successfully');
      } else {
        print(
          'Failed to send FCM token: ${response.statusCode} - ${response.body}',
        );
      }
    } catch (e) {
      print('Error sending FCM token: $e');
    }
  }

  /// Enregistre le token FCM après connexion
  Future<bool> registerToken() async {
    if (_fcmToken == null) {
      print('No FCM token available');
      return false;
    }

    try {
      await _sendTokenToServer(_fcmToken!);
      return true;
    } catch (e) {
      print('Error registering FCM token: $e');
      return false;
    }
  }

  /// Supprime le token FCM du serveur (lors de la déconnexion)
  Future<void> unregisterToken() async {
    try {
      final authToken = await ApiConfig.getAuthToken();
      if (authToken == null) return;

      final response = await http.delete(
        Uri.parse('${ApiConfig.baseUrl}/fcm/unregister/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $authToken',
        },
      );

      if (response.statusCode == 200) {
        print('FCM token unregistered successfully');
      }
    } catch (e) {
      print('Error unregistering FCM token: $e');
    }
  }

  /// Gère les notifications reçues au premier plan
  void _handleForegroundMessage(RemoteMessage message) {
    print('Foreground message: ${message.messageId}');

    RemoteNotification? notification = message.notification;

    if (notification != null) {
      _flutterLocalNotificationsPlugin.show(
        notification.hashCode,
        notification.title,
        notification.body,
        const NotificationDetails(
          android: AndroidNotificationDetails(
            'high_importance_channel',
            'Notifications Importantes',
            channelDescription: 'Canal pour les notifications importantes',
            importance: Importance.high,
            priority: Priority.high,
            icon: '@mipmap/ic_launcher',
          ),
        ),
        payload: jsonEncode(message.data),
      );
    }
  }

  /// Gère les clics sur les notifications
  void _handleNotificationClick(RemoteMessage message) {
    print('Notification clicked: ${message.data}');

    // TODO: Implémenter la navigation vers l'écran approprié
    // Vous pouvez utiliser un GlobalKey<NavigatorState> pour la navigation
    // ou un système de routing comme go_router
  }

  /// Gère les taps sur les notifications locales
  void _onNotificationTap(NotificationResponse notificationResponse) {
    final String? payload = notificationResponse.payload;
    if (payload != null) {
      print('Notification payload: $payload');
      // TODO: Naviguer vers l'écran approprié
    }
  }

  /// Affiche une notification locale
  Future<void> showNotification(String title, String body) async {
    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
          'high_importance_channel',
          'Notifications Importantes',
          channelDescription: 'Canal pour les notifications importantes',
          importance: Importance.high,
          priority: Priority.high,
          icon: '@mipmap/ic_launcher',
        );

    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidDetails,
    );

    await _flutterLocalNotificationsPlugin.show(
      DateTime.now().millisecond,
      title,
      body,
      notificationDetails,
    );
  }

  /// Annule toutes les notifications
  Future<void> cancelAllNotifications() async {
    await _flutterLocalNotificationsPlugin.cancelAll();
  }

  Future<Map<String, bool>> getNotificationPreferences() async {
    // TODO: Implémenter la récupération depuis le serveur
    return {
      'news_updates': true,
      'comments': true,
      'moderation': true,
      'daily_digest': false,
    };
  }

  Future<void> updateNotificationPreferences(
    Map<String, bool> preferences,
  ) async {
    // TODO: Implémenter l'envoi au serveur
    print("Preferences updated: $preferences");
  }

  Future<void> schedulePeriodicNotifications() async {
    // TODO: Implémenter les notifications périodiques
    print("Periodic notifications scheduled");
  }
}
