import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../../api';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScanning(true);
      }
    } catch (error) {
      console.error('Erreur accès caméra:', error);
      alert('Impossible d\'accéder à la caméra');
    }
  };
  

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const handleQRScan = async (qrData) => {
    try {
      // TODO: Parser le QR code et marquer la présence
      // await api.post('/presence/qr-scan', {
      //   qr_code: qrData,
      //   date: selectedDate,
      //   classe_id: selectedClass
      // });
      
      setScannedCode(qrData);
      setTimeout(() => {
        setScannedCode(null);
      }, 3000);
    } catch (error) {
      console.error('Erreur scan:', error);
      alert('Erreur lors du scan');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <QrCode className="text-orange-600" size={28} />
          Scanner QR Code
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Scannez les codes QR des élèves pour marquer leur présence
        </p>
      </div>

      {/* Configuration */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Classe</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
            >
              <option value="">Sélectionner...</option>
              {/* Options classes */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
            />
          </div>
          <div className="flex items-end">
            {!scanning ? (
              <button
                onClick={startScanning}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
              >
                <Camera size={20} />
                Démarrer le scan
              </button>
            ) : (
              <button
                onClick={stopScanning}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                Arrêter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scanner */}
      {scanning && (
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="relative max-w-md mx-auto">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg border-2 border-orange-500"
            />
            {scannedCode && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/90 rounded-lg">
                <div className="text-center text-white">
                  <CheckCircle2 size={48} className="mx-auto mb-2" />
                  <p className="font-bold">Code scanné !</p>
                  <p className="text-sm">{scannedCode}</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-center text-slate-500 text-sm mt-4">
            Pointez la caméra vers le code QR de l'élève
          </p>
        </div>
      )}

      {!scanning && (
        <div className="text-center py-10 text-slate-400 bg-white rounded-lg border border-slate-200">
          <QrCode size={48} className="mx-auto mb-2 opacity-50" />
          <p>Cliquez sur "Démarrer le scan" pour commencer</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;

