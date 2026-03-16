import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ShieldCheck = (props) => <MaterialCommunityIcons name="shield-check" {...props} />;
const Wallet = (props) => <MaterialCommunityIcons name="wallet" {...props} />;
const CheckCircle2 = (props) => <MaterialCommunityIcons name="check-circle" {...props} />;
const Info = (props) => <MaterialCommunityIcons name="information" {...props} />;

const ConfirmPayoutModal = ({ visible, onClose, navigation }) => {
  const handleConfirmWithdraw = () => {
    onClose();
    setTimeout(() => {
      navigation?.navigate('AttySuccessWithdrawal');
    }, 300);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Handle bar at the top */}
          <View style={styles.handle} />

          {/* Security Icon */}
          <View style={styles.shieldIconContainer}>
            <ShieldCheck size={32} color="#1E293B" />
          </View>

          <Text style={styles.modalTitle}>Confirm Payout Request</Text>
          <Text style={styles.modalSubtitle}>Review your withdrawal details below</Text>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount to Withdraw</Text>
              <Text style={styles.summaryValue}>₱184,200.00</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Transfer Fee</Text>
              <Text style={[styles.summaryValue, { color: '#10B981' }]}>₱0.00</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total to be Received</Text>
              <Text style={styles.totalValue}>₱184,200.00</Text>
            </View>
          </View>

          {/* Destination Account Card */}
          <View style={styles.accountCard}>
            <View style={styles.walletIconBg}>
              <Wallet size={20} color="#1E293B" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.accountName}>GCash: 0917****123</Text>
              <Text style={styles.accountSub}>DESTINATION ACCOUNT</Text>
            </View>
            <CheckCircle2 size={22} color="#1E293B" />
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Info size={18} color="#64748B" />
            <Text style={styles.infoText}>
              Funds will be transferred to your account within <Text style={{fontWeight: 'bold'}}>1-3 business days.</Text>
            </Text>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmWithdraw}>
            <Text style={styles.confirmBtnText}>Confirm & Withdraw</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Cancel Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // Dark semi-transparent background
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    marginVertical: 15,
  },
  shieldIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F1F5F9',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
    marginBottom: 25,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  summaryLabel: { fontSize: 14, color: '#94A3B8' },
  summaryValue: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 15,
  },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  
  accountCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    marginTop: 20,
  },
  walletIconBg: {
    width: 44,
    height: 44,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  accountSub: { fontSize: 10, color: '#94A3B8', fontWeight: 'bold', marginTop: 4 },
  
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: { flex: 1, marginLeft: 12, fontSize: 13, color: '#64748B', lineHeight: 18 },
  
  confirmBtn: {
    width: '100%',
    backgroundColor: '#0F172A',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    // Shadow for the button
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  cancelBtn: { marginTop: 20, padding: 10 },
  cancelBtnText: { color: '#94A3B8', fontWeight: 'bold' },
});

export default function ConfirmPayoutScreen({ navigation }) {
  const handleConfirmWithdraw = () => {
    setTimeout(() => {
      navigation?.navigate('AttySuccessWithdrawal');
    }, 300);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' }}>
      <View style={styles.modalContainer}>
        {/* Handle bar at the top */}
        <View style={styles.handle} />

        {/* Security Icon */}
        <View style={styles.shieldIconContainer}>
          <ShieldCheck size={32} color="#1E293B" />
        </View>

        <Text style={styles.modalTitle}>Confirm Payout Request</Text>
        <Text style={styles.modalSubtitle}>Review your withdrawal details below</Text>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount to Withdraw</Text>
            <Text style={styles.summaryValue}>₱184,200.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Transfer Fee</Text>
            <Text style={[styles.summaryValue, { color: '#10B981' }]}>₱0.00</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total to be Received</Text>
            <Text style={styles.totalValue}>₱184,200.00</Text>
          </View>
        </View>

        {/* Destination Account Card */}
        <View style={styles.accountCard}>
          <View style={styles.walletIconBg}>
            <Wallet size={20} color="#1E293B" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.accountName}>GCash: 0917****123</Text>
            <Text style={styles.accountSub}>DESTINATION ACCOUNT</Text>
          </View>
          <CheckCircle2 size={22} color="#1E293B" />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Info size={18} color="#64748B" />
          <Text style={styles.infoText}>
            Funds will be transferred to your account within <Text style={{fontWeight: 'bold'}}>1-3 business days.</Text>
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmWithdraw}>
          <Text style={styles.confirmBtnText}>Confirm & Withdraw</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={styles.cancelBtnText}>Cancel Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
