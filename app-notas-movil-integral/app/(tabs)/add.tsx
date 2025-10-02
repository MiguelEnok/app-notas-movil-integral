import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { db } from "../../lib/firebaseConfig";

export default function AddNotaScreen() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  const handleAdd = async () => {
    if (!titulo.trim() || !contenido.trim()) {
      Alert.alert("Error", "Debes llenar todos los campos");
      return;
    }

    try {
      await addDoc(collection(db, "notas"), {
        titulo,
        contenido,
        fecha_creacion: serverTimestamp(),
        fecha_modificacion: serverTimestamp(),
      });

      setTitulo("");
      setContenido("");
      Alert.alert("Éxito", "Nota agregada correctamente");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo guardar la nota");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Contenido"
        value={contenido}
        onChangeText={setContenido}
        multiline
      />
      <Button title="Guardar" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#edededff", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  multiline: {
    height: 120,
    textAlignVertical: "top",
  },
});
