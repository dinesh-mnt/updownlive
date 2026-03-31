"use client";
import Article from './Article';

export default function ArticleClient({ id }: { id: string }) {
  return <Article id={id} />;
}
