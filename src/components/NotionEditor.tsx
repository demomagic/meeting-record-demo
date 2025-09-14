'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Mic, Square, FileText, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface NotionEditorProps {
  className?: string;
}

export default function NotionEditor({ className = '' }: NotionEditorProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '开始输入... 或点击麦克风按钮进行语音输入',
      }),
    ],
    content: '<p></p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-6',
      },
    },
  });

  // 实时语音转文字功能 - 使用Web Speech API
  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('您的浏览器不支持语音识别功能，请使用Chrome或Edge浏览器');
      return;
    }

    const SpeechRecognition = (window as unknown as any).SpeechRecognition || (window as unknown as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // 启用连续识别和中间结果
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'zh-CN';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsProcessing(true);
      setInterimTranscript('');
      setFinalTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      // 处理所有识别结果
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      // 更新中间结果
      setInterimTranscript(interim);

      // 如果有最终结果，添加到编辑器
      if (final) {
        setFinalTranscript(prev => prev + final);
        if (editor) {
          // 在光标位置插入最终转录文本，并添加换行符
          editor.commands.insertContent(final + '\n');
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('语音识别错误:', event.error);
      setIsProcessing(false);
      setIsRecording(false);
      if (event.error === 'not-allowed') {
        alert('请允许访问麦克风权限');
      } else if (event.error === 'no-speech') {
        console.log('未检测到语音，继续监听...');
      }
    };

    recognition.onend = () => {
      setIsProcessing(false);
      setIsRecording(false);
      setInterimTranscript('');
    };

    recognition.start();
  };

  // 开始语音识别
  const startRecording = () => {
    startVoiceRecognition();
    setIsRecording(true);
  };

  // 停止语音识别
  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(false);
  };

  // 生成会议总结
  const generateSummary = async () => {
    if (!editor) return;

    const text = editor.getText();
    if (!text.trim()) {
      alert('请先输入会议内容');
      return;
    }

    setIsGeneratingSummary(true);
    setSummary('');
    setShowSummary(false);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成总结失败');
      }

      setSummary(data.summary);
      setShowSummary(true);
    } catch (error) {
      console.error('生成会议总结错误:', error);
      alert(error instanceof Error ? error.message : '生成会议总结失败，请稍后重试');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // 将总结插入编辑器
  const insertSummary = () => {
    if (editor && summary) {
      // 插入markdown格式的总结内容
      editor.commands.insertContent(`\n\n---\n\n${summary}\n\n`);
      setShowSummary(false);
    }
  };

  // 清理资源
  useEffect(() => {
    return () => {
      // 清理语音识别资源
    };
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-gray-800">会议记录</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 会议总结按钮 */}
          <button
            onClick={generateSummary}
            disabled={isGeneratingSummary || !editor?.getText().trim()}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${isGeneratingSummary
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : !editor?.getText().trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
              }
            `}
          >
            {isGeneratingSummary ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>生成中...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>生成总结</span>
              </>
            )}
          </button>

          {/* 语音录制按钮 */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : isProcessing
                ? 'bg-yellow-500 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
              }
            `}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4" />
                <span>停止录音</span>
              </>
            ) : isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>处理中...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>开始录音</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 编辑器区域 */}
      <div className="bg-white border-x border-b border-gray-200 rounded-b-lg min-h-[600px]">
        <EditorContent 
          editor={editor} 
          className="focus-within:outline-none"
        />
      </div>

      {/* 实时转录显示区域 */}
      {isRecording && (
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-500 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">正在实时转录...</span>
          </div>
          
          {/* 中间结果显示 */}
          {interimTranscript && (
            <div className="mb-2">
              <span className="text-xs text-gray-500">正在识别:</span>
              <div className="text-gray-600 italic bg-white p-2 rounded border-l-2 border-blue-400">
                {interimTranscript}
              </div>
            </div>
          )}
          
          {/* 最终结果显示 */}
          {finalTranscript && (
            <div>
              <span className="text-xs text-gray-500">已识别:</span>
              <div className="text-gray-800 bg-green-50 p-2 rounded border-l-2 border-green-400">
                {finalTranscript}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 会议总结显示区域 */}
      {showSummary && summary && (
        <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-600" />
              会议总结
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={insertSummary}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
              >
                插入到编辑器
              </button>
              <button
                onClick={() => setShowSummary(false)}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
          <div className="prose prose-sm max-w-none text-gray-700">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({children}) => <h1 className="text-xl font-bold text-gray-800 mt-6 mb-3 first:mt-0">{children}</h1>,
                h2: ({children}) => <h2 className="text-lg font-bold text-gray-800 mt-5 mb-2">{children}</h2>,
                h3: ({children}) => <h3 className="text-base font-bold text-gray-800 mt-4 mb-2">{children}</h3>,
                h4: ({children}) => <h4 className="text-sm font-bold text-gray-800 mt-3 mb-2">{children}</h4>,
                h5: ({children}) => <h5 className="text-sm font-bold text-gray-800 mt-3 mb-2">{children}</h5>,
                h6: ({children}) => <h6 className="text-xs font-bold text-gray-800 mt-3 mb-2">{children}</h6>,
                p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                li: ({children}) => <li className="text-sm">{children}</li>,
                strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                em: ({children}) => <em className="italic">{children}</em>,
                code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                pre: ({children}) => <pre className="bg-gray-100 p-3 rounded overflow-x-auto mb-3">{children}</pre>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-blue-300 pl-4 italic mb-3 bg-blue-50 py-2">{children}</blockquote>,
                hr: () => <hr className="border-gray-300 my-4" />,
                table: ({children}) => <div className="overflow-x-auto mb-4"><table className="min-w-full border-collapse border border-gray-300">{children}</table></div>,
                thead: ({children}) => <thead className="bg-gray-50">{children}</thead>,
                tbody: ({children}) => <tbody>{children}</tbody>,
                tr: ({children}) => <tr className="border-b border-gray-200">{children}</tr>,
                th: ({children}) => <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">{children}</th>,
                td: ({children}) => <td className="border border-gray-300 px-3 py-2 text-sm">{children}</td>
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
