// src/pages/Editor.jsx
import { useParams } from 'react-router-dom';
import EditorCard from '../components/EditorCard';

const Editor = () => {
  const { id } = useParams(); // from /editor/:id

  return (
    <div className="p-6">
      <EditorCard problemId={id} />
    </div>
  );
};

export default Editor;