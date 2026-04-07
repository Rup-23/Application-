import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import React, { useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from 'react-native';
import { db } from '../firebase';

export default function Home() {
  const [quotes, setQuotes] = useState([]);
  const [newQuote, setNewQuote] = useState('');
  const [showQuotes, setShowQuotes] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [editingId, setEditingId] = useState(null);

  //  Fetching 
  const fetchQuotes = async () => {
    const snapshot = await getDocs(collection(db, 'quotes'));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      text: doc.data().text,
      completed: doc.data().completed || false
    }));
    setQuotes(data);
    setShowQuotes(true);
  };

  //  Add / Update
  const handleAddOrUpdate = async () => {
    if (!newQuote.trim()) return;

    if (editingId) {
      await updateDoc(doc(db, 'quotes', editingId), {
        text: newQuote
      });
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'quotes'), {
        text: newQuote,
        completed: false
      });
    }

    setNewQuote('');
    setShowInput(false);
    fetchQuotes();
  };

  //  Delete
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'quotes', id));
    fetchQuotes();
  };

  // Toggle
  const toggleComplete = async (item) => {
    await updateDoc(doc(db, 'quotes', item.id), {
      completed: !item.completed
    });
    fetchQuotes();
  };

  //  Edit
  const handleEdit = (item) => {
    setNewQuote(item.text);
    setEditingId(item.id);
    setShowInput(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <Text style={styles.heading}>TODO APP</Text>

      <View style={styles.topActions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => {
          if (!showQuotes) fetchQuotes();
          else setShowQuotes(false);
        }}>
          <Text style={styles.btnText}>
            {showQuotes ? "Hide Todos" : "Show Todos"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => {
          setShowInput(!showInput);
          setEditingId(null);
          setNewQuote('');
        }}>
          <Text style={styles.btnText}>
            {showInput ? "Cancel" : "Add Todo"}
          </Text>
        </TouchableOpacity>
      </View>

      {showInput && (
        <View>
          <TextInput
            placeholder="Enter todo..."
            value={newQuote}
            onChangeText={setNewQuote}
            style={styles.input}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleAddOrUpdate}>
            <Text style={styles.btnText}>
              {editingId ? "Update Todo" : "Save Todo"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {showQuotes && (
        <FlatList
          data={quotes}
          keyExtractor={item => item.id}

          renderItem={({ item }) => (
            <View style={styles.card}>

              <Text style={[
                styles.text,
                item.completed && styles.completed
              ]}>
                {item.text}
              </Text>


           
              <View style={styles.actionRow}>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.editBtn]}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={styles.actionText}>EDIT</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.actionText}>DELETE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.doneBtn]}
                  onPress={() => toggleComplete(item)}
                >
                  <Text style={styles.actionText}>
                    {item.completed ? "UNDO" : "DONE"}
                  </Text>
                </TouchableOpacity>

              </View>

            </View>
          )}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f7fa',
  },

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e3a8a',
  },

  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },

  secondaryBtn: {
    flex: 1,
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },

  saveBtn: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },

  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: '#60a5fa',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    fontSize: 16,
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  text: {
    fontSize: 18,
    marginBottom: 12,
    color: '#1f2937',
    fontWeight: '500',
  },

  completed: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },

  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 20, 
    alignItems: 'center',
  },

  editBtn: {
    backgroundColor: '#fde68a', 
  },

  deleteBtn: {
    backgroundColor: '#fecaca', 
  },

  doneBtn: {
    backgroundColor: '#bbf7d0', 
  },

  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
});