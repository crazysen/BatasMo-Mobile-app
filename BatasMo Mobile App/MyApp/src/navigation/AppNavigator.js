import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Client Screens
import LandingPage from '../CLIENT/LandingPage';
import Login from '../CLIENT/Login';
import CreateAccount from '../CLIENT/CreateAccount';
import HomepageClient from '../CLIENT/HomepageClient';
import VerifyAccount from '../CLIENT/VerifyAccount';
import AccountCreated from '../CLIENT/AccountCreated';
import VerifyIdentity from '../CLIENT/VerifyIdentity';
import ResetPassword from '../CLIENT/ResetPassword';

// Attorney Screens
import AttorneyDashboard from '../ATTORNEY/AttyLandingPage';
import AttyVerifyEmail from '../ATTORNEY/AttyVerifyEmail';
import AttyAccountCreated from '../ATTORNEY/AttyAccountCreated';
import AttyVerifyIdentity from '../ATTORNEY/AttyVerifyIdentity';
import AttyResetPassword from '../ATTORNEY/AttyResetPassword';
import AttyMenu from '../ATTORNEY/AttyMenu';
import AttyConsultationRequest from '../ATTORNEY/AttyConsultationRequest';
import AttyConsultationMessage from '../ATTORNEY/AttyConsultationMessage';
import AttyMyAppointments from '../ATTORNEY/AttyMyAppointments';
import AttyNotarialServices from '../ATTORNEY/AttyNotarialServices';
import AttyAcceptNotarialRequest from '../ATTORNEY/AttyAcceptNotarialRequest';
import AttyNotarialRequestAccepted from '../ATTORNEY/AttyNotarialRequestAccepted';
import AttyNotarialRequestRejected from '../ATTORNEY/AttyNotarialRequestRejected';
import AttyMyEarnings from '../ATTORNEY/AttyMyEarnings';
import AttyPayoutDetails from '../ATTORNEY/AttyPayoutDetails';
import AttyConfirmPayout from '../ATTORNEY/AttyConfirmPayout';
import AttySuccessWithdrawal from '../ATTORNEY/AttySuccessWithdrawal';
import AttyProfileSettings from '../ATTORNEY/AttyProfileSettings';
import AttyAvailabilityManager from '../ATTORNEY/AttyAvailabilityManager';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LandingPage"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Common Screens */}
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CreateProfile" component={CreateAccount} />

        {/* Client Screens */}
        <Stack.Screen name="HomepageClient" component={HomepageClient} />
        <Stack.Screen name="VerifyAccount" component={VerifyAccount} />
        <Stack.Screen name="AccountCreated" component={AccountCreated} />
        <Stack.Screen name="VerifyIdentity" component={VerifyIdentity} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />

        {/* Attorney Screens - Authentication Flow */}
        <Stack.Screen name="AttyVerifyEmail" component={AttyVerifyEmail} />
        <Stack.Screen name="AttyAccountCreated" component={AttyAccountCreated} />
        <Stack.Screen name="AttyVerifyIdentity" component={AttyVerifyIdentity} />
        <Stack.Screen name="AttyResetPassword" component={AttyResetPassword} />

        {/* Attorney Screens - Main App */}
        <Stack.Screen name="AttyLandingPage" component={AttorneyDashboard} />
        <Stack.Screen name="AttyMenu" component={AttyMenu} />
        <Stack.Screen name="AttyAvailabilityManager" component={AttyAvailabilityManager} />
        <Stack.Screen name="AttyConsultationRequest" component={AttyConsultationRequest} />
        <Stack.Screen name="AttyConsultationMessage" component={AttyConsultationMessage} />
        <Stack.Screen name="AttyMyAppointments" component={AttyMyAppointments} />
        <Stack.Screen name="AttyNotarialServices" component={AttyNotarialServices} />
        <Stack.Screen name="AttyAcceptNotarialRequest" component={AttyAcceptNotarialRequest} />
        <Stack.Screen name="AttyNotarialRequestAccepted" component={AttyNotarialRequestAccepted} />
        <Stack.Screen name="AttyNotarialRequestRejected" component={AttyNotarialRequestRejected} />
        <Stack.Screen name="AttyMyEarnings" component={AttyMyEarnings} />
        <Stack.Screen name="AttyPayoutDetails" component={AttyPayoutDetails} />
        <Stack.Screen name="AttyConfirmPayout" component={AttyConfirmPayout} />
        <Stack.Screen name="AttySuccessWithdrawal" component={AttySuccessWithdrawal} />
        <Stack.Screen name="AttyProfileSettings" component={AttyProfileSettings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
