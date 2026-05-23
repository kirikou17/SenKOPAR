export const styles = {
  container: { maxWidth: '500px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', color: '#2c3e50', marginBottom: '5px' },
  subtitle: { textAlign: 'center', color: '#7f8c8d', fontSize: '14px', marginBottom: '25px' },
  progressBarContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', position: 'relative' },
  progressTrack: { position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', backgroundColor: '#e0e0e0', zIndex: 1 },
  progressFill: { position: 'absolute', top: '50%', left: 0, height: '2px', backgroundColor: '#2ecc71', zIndex: 1, transition: '0.3s ease' },
  stepCircle: { width: '35px', height: '35px', borderRadius: '50%', border: '2px solid', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', zIndex: 2, transition: '0.3s' },
  alert: { padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' },
  stepTitle: { color: '#34495e', marginBottom: '15px' },
  inputGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', marginTop: '5px', outline: 'none' },
  buttonGroup: { display: 'flex', gap: '10px' },
  primaryButton: { width: '100%', padding: '12px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  secondaryButton: { width: '40%', padding: '12px', backgroundColor: '#95a5a6', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  planList: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  planCard: { padding: '15px', border: '2px solid', borderRadius: '6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: '0.2s' }
};