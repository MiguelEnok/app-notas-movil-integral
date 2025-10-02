import { router } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../lib/firebaseConfig";

export default function NotasScreen() {
  const [notas, setNotas] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "notas"),
      orderBy("fecha_modificacion", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotas(data);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card}
      onPress={() => router.push({ pathname: "/notas/[id]", params: { id: item.id } })}
    >
      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.content} numberOfLines={2}>
        {item.contenido}
      </Text>
      <Text style={styles.date}>
        Última modificación:{" "}
        {item.fecha_modificacion?.toDate().toLocaleString() ?? "N/A"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No hay notas guardadas</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#edededff", padding: 10 },
  card: {
    backgroundColor: "#ffffffff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  content: { fontSize: 14, marginVertical: 5, color: "#555" },
  date: { fontSize: 12, color: "#5f82afff" },
});
