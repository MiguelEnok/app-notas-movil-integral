import { useRouter } from "expo-router";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../lib/firebaseConfig";

export default function NotasScreen() {
  const [notas, setNotas] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const router = useRouter();

  useEffect(() => {
    let q;

    if (search.trim() !== "") {
      q = query(
        collection(db, "notas"),
        where("titulo", ">=", search),
        where("titulo", "<=", search + "\uf8ff"),
        orderBy("titulo"),
        orderBy("fecha_modificacion", order)
      );
    } else {
      q = query(
        collection(db, "notas"),
        orderBy("fecha_modificacion", order)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotas(data);
    });

    return () => unsubscribe();
  }, [search, order]);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/notas/${item.id}`)}
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
      {/* 🔍 Búsqueda + Orden en la misma fila */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          placeholder="Buscar por título..."
          value={search}
          onChangeText={setSearch}
        />
        <Pressable
          style={styles.orderButton}
          onPress={() => setOrder(order === "desc" ? "asc" : "desc")}
        >
          <Text style={styles.orderText}>
            {order === "desc" ? "↓ Fecha" : "↑ Fecha"}
          </Text>
        </Pressable>
      </View>

      {/* 📋 Lista de notas */}
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

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  search: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: "#ffffffff",
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  orderButton: {
    backgroundColor: "#4da6ff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  orderText: { color: "#fff", fontWeight: "bold" },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderBlockColor: "#ccc",
    borderColor: "#ccc",
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  content: { fontSize: 14, marginVertical: 5, color: "#555" },
  date: { fontSize: 12, color: "#888" },
});
