import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {registerRootComponent} from 'expo';
import {StatusBar} from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import {REFERENCE_THEME as NavBase} from './constants/referenceTheme';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LandingPage from './screens/LandingPage';
import LoginAndSignup from './screens/LoginAndSignup';
import CreateAccount from './screens/CreateAccount';
import Login from './screens/Login.js';
import HomepageClient from './screens/HomepageClient';
import AttyLandingPage from './screens/AttyLandingPage';
import AttyMenu from './screens/AttyMenu';
import ClientMenu from './screens/ClientMenu';
import ClientNotification from './screens/ClientNotification';
import BookAppointment from './screens/BookAppointment';
import ClientNotarial from './screens/ClientNotarial';
import VerifyAccount from './screens/VerifyAccount';
import AccountCreated from './screens/AccountCreated';
import ProfileSettingsClient from './screens/ProfileSettingsClient';
import Messages from './screens/Messages';
import EnterConsultationChat from './screens/EnterConsultationChat';
import AttorneyProfile from './screens/AttorneyProfile';
import Chatbot from './screens/Chatbot';
import MyAppointments from './screens/MyAppointments.js';
import TransactionHistory from './screens/TransactionHistory.js';
import VerifyIdentity from './screens/VerifyIdentity.js';
import ResetPassword from './screens/ResetPassword.js';
import BookingRequestSubmitted from './screens/BookingRequestSubmitted.js';
import RescheduleAppointment from './screens/RescheduleAppointment.js';
import BookingSummary from './screens/BookingSummary.js';
import Payment from './screens/Payment.js';
import PaymentSuccessful from './screens/PaymentSuccessful.js';
import PaymentTranscript from './screens/PaymentTranscript.js';
import BookNow from './screens/BookNow.js';
import NotarialRequestSubmitted from './screens/NotarialRequestSubmitted.js';
import PaymentMethod from './screens/PaymentMethod.js';
import UploadIDScreen from './screens/UploadIDScreen.js';
import FaceRecognitionScreen from './screens/FaceRecognitionScreen.js';
import {UserProfileProvider} from './context/UserProfileContext';
import AttyConsultationMessage from './screens/AttyConsultationMessage';
import AttyMyEarnings from './screens/AttyMyEarnings';
import AttyPayoutDetails from './screens/AttyPayoutDetails';
import AttyConfirmPayout from './screens/AttyConfirmPayout';
import AttySuccessWithdrawal from './screens/AttySuccessWithdrawal';
import AttyProfileSettings from './screens/AttyProfileSettings';
import AttyAvailabilityManager from './screens/AttyAvailabilityManager';
import AttyMyAppointments from './screens/AttyMyAppointments';
import AdminCreateAttorney from './screens/AdminCreateAttorney';
import ConsultationTranscript from './screens/ConsultationTranscript';
import ClientConsultationLogs from './screens/ClientConsultationLogs';
import AttorneyConsultationLogs from './screens/AttorneyConsultationLogs';

const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: NavBase.base,
    card: NavBase.base,
    border: 'rgba(244, 215, 139, 0.12)',
    primary: NavBase.gold[1],
    text: NavBase.text,
    notification: NavBase.gold[1],
  },
};

function App() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(NavBase.base).catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: NavBase.base}}>
      <SafeAreaProvider style={{flex: 1, backgroundColor: NavBase.base}}>
        <UserProfileProvider>
          <NavigationContainer theme={navigationTheme}>
            <StatusBar style="light" />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                animationDuration: 300,
                contentStyle: {backgroundColor: NavBase.base},
                freezeOnBlur: false,
              }}
              initialRouteName="Landing">
              <Stack.Screen name="Landing" component={LandingPage} />
              <Stack.Screen name="LoginSignup" component={LoginAndSignup} />
              <Stack.Screen name="CreateProfile" component={CreateAccount} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="VerifyAccount" component={VerifyAccount} />
              <Stack.Screen name="AccountCreated" component={AccountCreated} />
              <Stack.Screen name="HomepageClient" component={HomepageClient} />
              <Stack.Screen name="AttyLandingPage" component={AttyLandingPage} />
              <Stack.Screen name="AttyMenu" component={AttyMenu} />
              <Stack.Screen name="ClientMenu" component={ClientMenu} />
              <Stack.Screen name="ClientNotification" component={ClientNotification} />
              <Stack.Screen name="BookAppointment" component={BookAppointment} />
              <Stack.Screen name="ClientNotarial" component={ClientNotarial} />
              <Stack.Screen name="ProfileSettingsClient" component={ProfileSettingsClient} />
              <Stack.Screen name="Messages" component={Messages} />
              <Stack.Screen name="EnterConsultationChat" component={EnterConsultationChat} />
              <Stack.Screen name="AttorneyProfile" component={AttorneyProfile} />
              <Stack.Screen name="Chatbot" component={Chatbot} />
              <Stack.Screen name="MyAppointments" component={MyAppointments} />
              <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
              <Stack.Screen name="VerifyIdentity" component={VerifyIdentity} />
              <Stack.Screen name="ResetPassword" component={ResetPassword} />
              <Stack.Screen name="BookingRequestSubmitted" component={BookingRequestSubmitted} />
              <Stack.Screen name="RescheduleAppointment" component={RescheduleAppointment} />
              <Stack.Screen name="BookingSummary" component={BookingSummary} />
              <Stack.Screen name="Payment" component={Payment} />
              <Stack.Screen name="PaymentSuccessful" component={PaymentSuccessful} />
              <Stack.Screen name="PaymentTranscript" component={PaymentTranscript} />
              <Stack.Screen name="BookNow" component={BookNow} />
              <Stack.Screen name="NotarialRequestSubmitted" component={NotarialRequestSubmitted} />
              <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
              <Stack.Screen name="UploadIDScreen" component={UploadIDScreen} />
              <Stack.Screen name="FaceRecognitionScreen" component={FaceRecognitionScreen} />
              <Stack.Screen name="AttyAvailabilityManager" component={AttyAvailabilityManager} />
              <Stack.Screen name="AttyConsultationMessage" component={AttyConsultationMessage} />
              <Stack.Screen name="AttyMyEarnings" component={AttyMyEarnings} />
              <Stack.Screen name="AttyPayoutDetails" component={AttyPayoutDetails} />
              <Stack.Screen name="AttyConfirmPayout" component={AttyConfirmPayout} />
              <Stack.Screen name="AttySuccessWithdrawal" component={AttySuccessWithdrawal} />
              <Stack.Screen name="AttyProfileSettings" component={AttyProfileSettings} />
              <Stack.Screen name="AttyMyAppointments" component={AttyMyAppointments} />
              <Stack.Screen name="AdminCreateAttorney" component={AdminCreateAttorney} />
              <Stack.Screen name="ConsultationTranscript" component={ConsultationTranscript} />
              <Stack.Screen name="ClientConsultationLogs" component={ClientConsultationLogs} />
              <Stack.Screen name="AttorneyConsultationLogs" component={AttorneyConsultationLogs} />
            </Stack.Navigator>
          </NavigationContainer>
        </UserProfileProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);
