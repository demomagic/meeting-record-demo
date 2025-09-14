import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: '文本内容不能为空' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API密钥未配置，请在环境变量中设置OPENAI_API_KEY' },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的会议记录助手。请将以下会议记录内容整理成结构化的会议总结。

请严格按照以下markdown格式输出，使用丰富的markdown语法：

# 📋 会议总结

## 📅 会议基本信息
- **会议时间**：[根据内容推断或记录的时间]
- **会议主题**：[根据内容推断会议主题]
- **参会人员**：[从内容中提取的参会人员]
- **会议类型**：[如：项目评审、需求讨论、进度汇报等]

## 🎯 主要议题与讨论

### 议题1：[议题标题]
- **讨论内容**：[详细讨论内容]
- **结论**：[达成的结论或决定]

### 议题2：[议题标题]
- **讨论内容**：[详细讨论内容]
- **结论**：[达成的结论或决定]

## ✅ 关键决策
> **重要决策记录**

1. **[决策标题1]**
   - 决策内容：[具体决策内容]
   - 决策原因：[决策依据]
   - 影响范围：[影响的团队/项目]

2. **[决策标题2]**
   - 决策内容：[具体决策内容]
   - 决策原因：[决策依据]
   - 影响范围：[影响的团队/项目]

## 📝 行动项与任务分配

| 任务描述 | 负责人 | 截止时间 | 优先级 | 状态 |
|---------|--------|----------|--------|------|
| [任务1] | [姓名] | [日期] | 🔴高/🟡中/🟢低 | ⏳待开始 |
| [任务2] | [姓名] | [日期] | 🔴高/🟡中/🟢低 | ⏳待开始 |

## ⚠️ 风险与问题
- **风险1**：[风险描述] - *缓解措施*：[建议措施]
- **风险2**：[风险描述] - *缓解措施*：[建议措施]

## 📊 数据与指标
如果会议涉及数据讨论，请整理：
- **关键指标**：[重要数据点]
- **目标值**：[预期目标]
- **当前状态**：[现状描述]

## 🔄 下次会议安排
- **建议时间**：[建议的会议时间]
- **建议议题**：
  - [议题1]
  - [议题2]
- **需要准备的材料**：[需要提前准备的内容]

---

> **备注**：请根据实际会议内容调整各部分的详细程度，确保信息准确且易于理解。`
        },
        {
          role: 'user',
          content: text
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const summary = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ summary });

  } catch (error) {
    console.error('OpenAI API错误:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API密钥无效，请检查配置' },
          { status: 401 }
        );
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'OpenAI API配额不足，请检查账户余额' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: '生成会议总结时发生错误，请稍后重试' },
      { status: 500 }
    );
  }
}
