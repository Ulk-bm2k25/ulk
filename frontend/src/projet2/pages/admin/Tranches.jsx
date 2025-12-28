import { useState, useEffect } from "react";
import { createTranche, deleteTranche } from "../../services/trancheService";

export default function Tranches() {
  const [tranches, setTranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fee_id: "",
    label: "",
    amount: "",
    due_date: "",
  });

  useEffect(() => {
    fetchTranches();
  }, []);

  const fetchTranches = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/fees");
      const data = await res.json();
      const allTranches = data.flatMap(fee => fee.tranches || []);
      setTranches(allTranches);
    } catch (error) {
      console.error("Erreur fetch tranches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTranche({
        fee_id: form.fee_id,
        label: form.label,
        amount: parseInt(form.amount),
        due_date: form.due_date,
      });
      setForm({ fee_id: "", label: "", amount: "", due_date: "" });
      fetchTranches();
    } catch (error) {
      console.error("Erreur création tranche:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette tranche ?")) {
      return;
    }
    try {
      await deleteTranche(id);
      fetchTranches();
    } catch (error) {
      console.error("Erreur suppression tranche:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Styles inline modernes
  const styles = {
    page: {
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '30px',
      paddingBottom: '15px',
      borderBottom: '1px solid #e1e5eb'
    },
    title: {
      color: '#2c3e50',
      fontSize: '28px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#7f8c8d',
      fontSize: '16px'
    },
    layout: {
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    },
    formSection: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '25px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      border: '1px solid #e1e5eb'
    },
    formTitle: {
      color: '#3498db',
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#2c3e50',
      fontWeight: '500',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '16px',
      transition: 'all 0.3s',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#3498db',
      boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.1)',
      outline: 'none'
    },
    submitBtn: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '14px 25px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      transition: 'background-color 0.3s'
    },
    tableSection: {
      backgroundColor: 'white',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      border: '1px solid #e1e5eb'
    },
    tableHeader: {
      padding: '20px',
      borderBottom: '1px solid #e1e5eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    tableTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#2c3e50'
    },
    badge: {
      backgroundColor: '#ecf0f1',
      color: '#7f8c8d',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '500'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      backgroundColor: '#f8f9fa',
      padding: '15px',
      textAlign: 'left',
      color: '#7f8c8d',
      fontWeight: '600',
      fontSize: '14px',
      borderBottom: '1px solid #e1e5eb'
    },
    td: {
      padding: '15px',
      borderBottom: '1px solid #e1e5eb',
      color: '#2c3e50'
    },
    amountCell: {
      color: '#27ae60',
      fontWeight: '600'
    },
    deleteBtn: {
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.3s'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#7f8c8d'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#95a5a6'
    },
    plusIcon: {
      marginRight: '10px',
      fontSize: '20px'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Gestion des Tranches</h1>
          <p style={styles.subtitle}>Créez et gérez les tranches de paiement</p>
        </div>

        <div style={styles.layout}>
          {/* Formulaire */}
          <div style={styles.formSection}>
            <h2 style={styles.formTitle}>
              <span style={styles.plusIcon}>+</span> Nouvelle Tranche
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>ID du frais</label>
                  <input
                    type="text"
                    name="fee_id"
                    value={form.fee_id}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                    placeholder="Ex: 123"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Label</label>
                  <input
                    type="text"
                    name="label"
                    value={form.label}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                    placeholder="Ex: Tranche 1"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Montant (€)</label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                    placeholder="Ex: 1500"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Date limite</label>
                  <input
                    type="date"
                    name="due_date"
                    value={form.due_date}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                style={styles.submitBtn}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
              >
                Créer la tranche
              </button>
            </form>
          </div>

          {/* Tableau */}
          <div style={styles.tableSection}>
            <div style={styles.tableHeader}>
              <h2 style={styles.tableTitle}>Tranches existantes</h2>
              <span style={styles.badge}>{tranches.length} tranche{tranches.length !== 1 ? 's' : ''}</span>
            </div>

            {loading ? (
              <div style={styles.loading}>
                <p>Chargement des tranches...</p>
              </div>
            ) : tranches.length === 0 ? (
              <div style={styles.emptyState}>
                <p>Aucune tranche disponible. Créez votre première tranche.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Frais ID</th>
                      <th style={styles.th}>Label</th>
                      <th style={styles.th}>Montant</th>
                      <th style={styles.th}>Date limite</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tranches.map((t) => (
                      <tr key={t.id}>
                        <td style={styles.td}>
                          <span style={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}>
                            #{t.fee_id}
                          </span>
                        </td>
                        <td style={styles.td}>{t.label}</td>
                        <td style={{...styles.td, ...styles.amountCell}}>{formatAmount(t.amount)}</td>
                        <td style={styles.td}>{formatDate(t.due_date)}</td>
                        <td style={styles.td}>
                          <button
                            onClick={() => handleDelete(t.id)}
                            style={styles.deleteBtn}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}