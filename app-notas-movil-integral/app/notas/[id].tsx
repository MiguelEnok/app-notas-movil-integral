import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { db } from "../../lib/firebaseConfig";

export default function EditNotaScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  useEffect(() => {
    const fetchNota = async () => {
      try {
        const docRef = doc(db, "notas", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitulo(data.titulo);
          setContenido(data.contenido);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchNota();
  }, [id]);

  const handleUpdate = async () => {
    if (!titulo.trim() || !contenido.trim()) {
      Alert.alert("Error", "Debes llenar todos los campos");
      return;
    }
    try {
      const docRef = doc(db, "notas", id as string);
      await updateDoc(docRef, {
        titulo,
        contenido,
        fecha_modificacion: serverTimestamp(),
      });
      Alert.alert("Éxito", "Nota actualizada");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo actualizar la nota");
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
      <Button title="Guardar cambios" onPress={handleUpdate} />
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
