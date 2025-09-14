'use client';

import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

export default function UsageGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 帮助按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
        title="使用说明"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* 模态框 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">使用说明</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">📝 文本编辑</h3>
                <p className="text-gray-600 text-sm">
                  直接在编辑器中输入文本，支持基本的富文本格式。
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">🤖 AI会议总结</h3>
                <ol className="text-gray-600 text-sm space-y-1 list-decimal list-inside">
                  <li>输入会议内容后，点击&ldquo;生成总结&rdquo;按钮</li>
                  <li>AI会自动分析内容并生成结构化总结</li>
                  <li>总结包含：会议主题、主要议题、关键决策、行动项等</li>
                  <li>可以预览总结内容，选择插入到编辑器或关闭</li>
                </ol>
                <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
                  ⚠️ 需要配置OpenAI API密钥才能使用此功能
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">🎤 实时语音转录</h3>
                <ol className="text-gray-600 text-sm space-y-1 list-decimal list-inside">
                  <li>点击&ldquo;开始录音&rdquo;按钮</li>
                  <li>允许浏览器访问麦克风权限</li>
                  <li>开始说话，可以看到实时转录结果</li>
                  <li>中间结果显示为斜体，最终结果会插入编辑器</li>
                  <li>点击&ldquo;停止录音&rdquo;结束语音输入</li>
                </ol>
                <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                  💡 支持连续语音识别，可以长时间录音
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">⚠️ 注意事项</h3>
                <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                  <li>需要Chrome或Edge浏览器</li>
                  <li>首次使用需要允许麦克风权限</li>
                  <li>建议在安静环境中使用</li>
                  <li>语音识别需要网络连接</li>
                </ul>
              </div>
            </div>

            {/* 底部 */}
            <div className="p-6 border-t">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
