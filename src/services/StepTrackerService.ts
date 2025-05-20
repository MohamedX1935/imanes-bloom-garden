
import { BackgroundRunner } from '@capacitor/background-runner';
import { getUserProfile } from '@/components/settings/UserSettings';

export class StepTrackerService {
  private static instance: StepTrackerService;
  private isTracking = false;
  
  private constructor() {}
  
  public static getInstance(): StepTrackerService {
    if (!StepTrackerService.instance) {
      StepTrackerService.instance = new StepTrackerService();
    }
    return StepTrackerService.instance;
  }
  
  /**
   * Démarrer le suivi des pas en arrière-plan
   */
  public async startTracking() {
    try {
      if (this.isTracking) return;
      
      // Fix: BackgroundRunner.checkPermissions() doesn't have a display property
      // Fix: BackgroundRunner.requestPermissions() needs an argument
      try {
        // Using a more generic approach for permissions that works across Capacitor versions
        await BackgroundRunner.requestPermissions({
          apis: ["geolocation", "notifications"]
        });
      } catch (err) {
        console.warn('Permission request error:', err);
      }
      
      // Code JavaScript qui s'exécutera en arrière-plan
      const jsCode = `
        let lastAcceleration = { x: 0, y: 0, z: 0 };
        let lastStepTime = 0;
        
        // Fonction qui sera exécutée en arrière-plan
        function trackSteps() {
          try {
            // Simuler la détection des pas (le vrai code utiliserait les capteurs du dispositif)
            const now = new Date().getTime();
            if (now - lastStepTime > 300) { // Limiter la fréquence
              // Simuler un mouvement
              const x = Math.random() * 20 - 10;
              const y = Math.random() * 20 - 10;
              const z = Math.random() * 20 - 10;
              
              const deltaX = Math.abs(x - lastAcceleration.x);
              const deltaY = Math.abs(y - lastAcceleration.y);
              const deltaZ = Math.abs(z - lastAcceleration.z);
              
              const acceleration = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
              
              // Seuil pour la détection des pas
              if (acceleration > 10) {
                // Charger les données existantes
                const savedSteps = localStorage.getItem('todaySteps');
                let stepData = { steps: 0, distance: 0, calories: 0 };
                let date = new Date().toDateString();
                
                if (savedSteps) {
                  const data = JSON.parse(savedSteps);
                  if (data.date === date) {
                    stepData = data.stepData;
                  }
                }
                
                // Incrémenter les pas
                stepData.steps += 1;
                
                // Calculer la distance et les calories (simulation)
                stepData.distance = parseFloat((stepData.steps * 0.0007).toFixed(2));
                stepData.calories = Math.round(stepData.steps * 0.05);
                
                // Sauvegarder les données
                localStorage.setItem('todaySteps', JSON.stringify({
                  date,
                  stepData
                }));
                
                // Mettre à jour le widget si possible
                if (typeof updateWidget === 'function') {
                  updateWidget(stepData.steps, stepData.distance, stepData.calories);
                }
                
                // Mettre à jour le dernier temps
                lastStepTime = now;
              }
              
              lastAcceleration = { x, y, z };
            }
          } catch (e) {
            console.error('Erreur dans le suivi des pas en arrière-plan:', e);
          }
        }
        
        // Exécuter à intervalles réguliers
        setInterval(trackSteps, 1000);
      `;
      
      // Fix: Use the correct format for dispatchEvent with the required details property
      await BackgroundRunner.dispatchEvent({
        label: 'step_tracking',
        event: 'step_tracking',
        details: {
          jsCode: jsCode
        }
      });
      
      this.isTracking = true;
      console.log('Suivi des pas en arrière-plan démarré');
      
      return true;
    } catch (error) {
      console.error('Erreur lors du démarrage du suivi des pas:', error);
      return false;
    }
  }
  
  /**
   * Arrêter le suivi des pas en arrière-plan
   */
  public async stopTracking() {
    try {
      // Fix: Using the correct method to stop background tasks
      // Checking the BackgroundRunner API documentation shows we need to use cancelTask
      await BackgroundRunner.cancelTask({
        taskId: 'step_tracking'
      });
      this.isTracking = false;
      console.log('Suivi des pas en arrière-plan arrêté');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'arrêt du suivi des pas:', error);
      return false;
    }
  }
  
  /**
   * Vérifier si le suivi est actif
   */
  public isTrackingActive() {
    return this.isTracking;
  }
}

export const stepTrackerService = StepTrackerService.getInstance();
