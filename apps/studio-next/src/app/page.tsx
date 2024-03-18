import { Editor } from '@/components/Editor/Editor';
import { HTMLWrapper } from '@/components/Template';

export default function Home() {
  return (
    <main className="flex flex-row w-full h-screen">
      <Editor />
      <HTMLWrapper />
    </main>
  )
}
