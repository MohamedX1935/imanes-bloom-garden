
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { PushNotifications, Token } from '@capacitor/push-notifications';

export class NotificationService {
  private static instance: NotificationService;
  
  private constructor() {
    this.initLocalNotifications();
    this.initPushNotifications();
  }
  
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }
  
  private async initLocalNotifications() {
    try {
      const permissionStatus = await LocalNotifications.requestPermissions();
      console.log('Notification permissions:', permissionStatus.display);
    } catch (error) {
      console.error('Error initializing local notifications:', error);
    }
  }
  
  private async initPushNotifications() {
    try {
      const permissionStatus = await PushNotifications.requestPermissions();
      if (permissionStatus.receive === 'granted') {
        await PushNotifications.register();
        
        // Add listeners
        PushNotifications.addListener('registration', (token: Token) => {
          console.log('Push registration success, token:', token.value);
        });
        
        PushNotifications.addListener('registrationError', (error: any) => {
          console.error('Error on registration:', error);
        });
        
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push notification received:', notification);
        });
        
        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('Push notification action performed:', notification);
        });
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }
  
  /**
   * Planifier une notification d'habitude
   */
  public async scheduleHabitReminder(habitId: string, habitName: string, time: { hour: number, minute: number }) {
    try {
      // Créer un ID unique pour chaque habitude pour pouvoir mettre à jour les notifications plus tard
      const notificationId = parseInt(habitId, 10) || Math.floor(Math.random() * 1000000);
      
      const now = new Date();
      const scheduledTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        time.hour,
        time.minute
      );
      
      // Si l'heure prévue est déjà passée aujourd'hui, planifier pour demain
      if (scheduledTime < now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      const options: ScheduleOptions = {
        notifications: [
          {
            id: notificationId,
            title: '💚 Rappel d\'habitude',
            body: `N'oublie pas: ${habitName}`,
            schedule: { at: scheduledTime, repeats: true, every: 'day' },
            extra: { habitId }
          }
        ]
      };
      
      await LocalNotifications.schedule(options);
      console.log(`Notification planifiée pour ${habitName} à ${time.hour}:${time.minute}`);
      return notificationId;
    } catch (error) {
      console.error('Erreur lors de la planification de la notification:', error);
      throw error;
    }
  }
  
  /**
   * Annuler une notification d'habitude
   */
  public async cancelHabitReminder(notificationId: number) {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
      console.log(`Notification ${notificationId} annulée`);
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la notification:', error);
      throw error;
    }
  }
  
  /**
   * Envoyer une notification immédiate
   */
  public async sendImmediateNotification(title: string, body: string) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Math.random() * 1000000),
            title,
            body,
            schedule: { at: new Date(Date.now() + 1000) } // 1 seconde plus tard
          }
        ]
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification immédiate:', error);
      throw error;
    }
  }
  
  /**
   * Vérifier les permissions de notification
   */
  public async checkPermissions() {
    return await LocalNotifications.checkPermissions();
  }
}

// Exporter l'instance singleton
export const notificationService = NotificationService.getInstance();
