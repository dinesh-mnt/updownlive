"use client";
import CryptoDetailPage from './CryptoDetailPage';

export default function CryptoDetailClient({ id }: { id: string }) {
  return <CryptoDetailPage id={id} />;
}
