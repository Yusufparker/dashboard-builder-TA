import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const createSlug = (title : string) => {
    return title
        .toString() // Konversi ke string
        .toLowerCase() // Ubah ke huruf kecil
        .trim() // Hapus spasi di awal dan akhir
        .replace(/[\s_]+/g, "-") // Ganti spasi atau underscore dengan "-"
        .replace(/[^\w\-]+/g, "") // Hapus karakter non-alphanumeric
        .replace(/\-\-+/g, "-"); // Ganti "--" menjadi "-"
};

export const capitalizeWords = (str : string) => {
    return str
        .split(" ") // Memisahkan kalimat menjadi array kata
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ) // Mengubah huruf pertama menjadi besar
        .join(" "); // Menggabungkan kembali array menjadi kalimat
}