import React, { useEffect, useRef, useState } from 'react';
import './DocumentEditor.css';

declare global {
  interface Window {
    Office: any;
  }
}

const DocumentEditor: React.FC = () => {
  const [isOfficeReady, setIsOfficeReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Office JavaScript API 로드
    const loadOfficeAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://appsforoffice.microsoft.com/lib/1/hosted/office.js';
      script.onload = () => {
        if (window.Office) {
          window.Office.onReady((info: any) => {
            if (info.host === window.Office.HostType.Word) {
              setIsOfficeReady(true);
            } else {
              setError('Word Online이 필요합니다.');
            }
          });
        }
      };
      script.onerror = () => {
        setError('Office API 로드에 실패했습니다.');
      };
      document.head.appendChild(script);
    };

    loadOfficeAPI();

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      const scripts = document.querySelectorAll('script[src*="office.js"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  const insertText = async () => {
    try {
      await window.Office.context.document.body.insertText(
        '이것은 테스트 텍스트입니다.',
        window.Office.InsertLocation.end
      );
    } catch (err) {
      setError('텍스트 삽입에 실패했습니다.');
    }
  };

  const insertImage = async () => {
    try {
      const imageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      await window.Office.context.document.body.insertInlinePictureFromBase64(
        imageBase64,
        window.Office.InsertLocation.end
      );
    } catch (err) {
      setError('이미지 삽입에 실패했습니다.');
    }
  };

  const saveDocument = async () => {
    try {
      await window.Office.context.document.save();
      alert('문서가 저장되었습니다.');
    } catch (err) {
      setError('문서 저장에 실패했습니다.');
    }
  };

  const loadFileContent = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Word 문서를 현재 문서에 삽입
      await window.Office.context.document.body.insertOoxml(
        arrayBuffer,
        window.Office.InsertLocation.replace
      );
    } catch (err) {
      setError('파일 로드에 실패했습니다.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      loadFileContent(file);
    } else {
      setError('Word 파일(.docx)만 업로드 가능합니다.');
    }
  };

  if (error) {
    return (
      <div className="document-editor">
        <div className="error-message">
          <h3>오류 발생</h3>
          <p>{error}</p>
          <div className="error-help">
            <h4>Microsoft Office Online 사용 방법:</h4>
            <ol>
              <li>Microsoft 365 계정으로 로그인</li>
              <li>Word Online에서 새 문서 생성</li>
              <li>이 페이지를 Word Online Add-in으로 설치</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (!isOfficeReady) {
    return (
      <div className="document-editor">
        <div className="loading">
          <h3>Office API 로딩 중...</h3>
          <p>Microsoft Office Online 환경에서 실행해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="document-editor">
      <div className="toolbar">
        <h2>문서 편집기</h2>
        <div className="toolbar-buttons">
          <input
            type="file"
            accept=".docx"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload" className="btn btn-upload">
            파일 업로드
          </label>
          <button onClick={insertText} className="btn btn-primary">
            텍스트 삽입
          </button>
          <button onClick={insertImage} className="btn btn-secondary">
            이미지 삽입
          </button>
          <button onClick={saveDocument} className="btn btn-success">
            저장
          </button>
        </div>
      </div>
      
      <div className="editor-container" ref={containerRef}>
        <div className="editor-placeholder">
          <p>Microsoft Word Online에서 이 Add-in을 사용하여 문서를 편집하세요.</p>
          <p>위의 버튼들을 사용하여 텍스트와 이미지를 삽입하고 문서를 저장할 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;