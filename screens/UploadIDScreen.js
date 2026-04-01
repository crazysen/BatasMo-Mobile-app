import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';

export default function UploadIDScreen({ navigation, route }) {
  const notarialData = route?.params?.notarialData || {};
  const [documentFile, setDocumentFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const pickID = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) {
        return;
      }

      setDocumentFile(asset);
    } catch (error) {
      Alert.alert('Error', error?.message ?? 'Unable to pick Valid ID.');
    }
  };

  const handleNext = async () => {
    if (!documentFile?.uri) {
      Alert.alert('Error', 'Please upload a Valid/Government ID before proceeding.');
      return;
    }

    try {
      setSubmitting(true);
      
      let idBase64 = await FileSystem.readAsStringAsync(documentFile.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const updatedNotarialData = {
        ...notarialData,
        id_name: documentFile.name,
        id_base64: idBase64,
      };

      navigation.navigate('FaceRecognitionScreen', { notarialData: updatedNotarialData });
    } catch (error) {
      Alert.alert('Error', 'Failed to process the uploaded ID. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.canGoBack() ? navigation.goBack() : null}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Verification step</Text>
          <Text style={styles.headerSubtitle}>
            Please upload a valid government ID
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Upload ID</Text>
          <Text style={styles.instructionText}>
            To process your Affidavit of Loss, we need to verify your identity. Please upload a clear photo or PDF of a valid government ID.
          </Text>

          <Text style={styles.inputLabel}>Valid/Government ID</Text>
          <TouchableOpacity style={styles.uploadArea} onPress={pickID}>
            <Text style={styles.uploadMainText}>
              {documentFile?.name || 'Click to upload your ID'}
            </Text>
            <Text style={styles.uploadSubText}>JPG, PNG, PDF (max 10MB)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, (!documentFile || submitting) && styles.submitButtonDisabled]}
            onPress={handleNext}
            disabled={!documentFile || submitting}>
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Next</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, flexDirection: 'row', alignItems: 'flex-start' },
  backButton: { paddingVertical: 6, marginRight: 8 },
  backText: { color: '#EAB308', fontWeight: '700', fontSize: 16 },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  headerSubtitle: { fontSize: 13, color: '#64748B' },
  content: { padding: 20 },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 10 },
  instructionText: { fontSize: 14, color: '#475569', marginBottom: 20, lineHeight: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8, marginTop: 15 },
  uploadArea: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    marginBottom: 30,
  },
  uploadMainText: { fontSize: 14, fontWeight: '700', color: '#1E293B', textAlign: 'center' },
  uploadSubText: { fontSize: 12, color: '#64748B', marginTop: 4 },
  submitButton: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
