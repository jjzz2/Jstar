import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';

// 自定义AI助手图标组件
export const AiAssistantIcon = ({ style, className, ...props }) => (
  <svg
    viewBox="0 0 1024 1024"
    width="1em"
    height="1em"
    fill="currentColor"
    style={style}
    className={className}
    {...props}
  >
    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
    <path d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"/>
    <circle cx="512" cy="512" r="32" fill="#1890ff"/>
    <path d="M512 256c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm0 448c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32z"/>
  </svg>
);

export const SmartRobotIcon = ({ style, className, ...props }) => (
  <svg
    viewBox="0 0 1024 1024"
    width="1em"
    height="1em"
    fill="currentColor"
    style={style}
    className={className}
    {...props}
  >
    <path d="M300 432h424c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H300c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"/>
    <path d="M300 592h424c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H300c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"/>
    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
    <circle cx="400" cy="300" r="24" fill="#1890ff"/>
    <circle cx="624" cy="300" r="24" fill="#1890ff"/>
    <path d="M512 800c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/>
  </svg>
);

export const ChatBotIcon = ({ style, className, ...props }) => (
  <svg
    viewBox="0 0 1024 1024"
    width="1em"
    height="1em"
    fill="currentColor"
    style={style}
    className={className}
    {...props}
  >
    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
    <path d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"/>
    <path d="M200 600h624c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H200c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"/>
    <circle cx="512" cy="512" r="32" fill="#1890ff"/>
  </svg>
);

// 为了兼容性，也提供iconfont方式
const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
  ],
});

export const AiIcon = (props) => <IconFont type="icon-ai" {...props} />;
export const RobotIcon = (props) => <IconFont type="icon-robot" {...props} />;
export const AssistantIcon = (props) => <IconFont type="icon-assistant" {...props} />;
export const ChatIcon = (props) => <IconFont type="icon-chat" {...props} />;
export const SmartIcon = (props) => <IconFont type="icon-smart" {...props} />;
export const BrainIcon = (props) => <IconFont type="icon-brain" {...props} />;
export const MessageIcon = (props) => <IconFont type="icon-message" {...props} />;
export const BotIcon = (props) => <IconFont type="icon-bot" {...props} />;
export const IntelligenceIcon = (props) => <IconFont type="icon-intelligence" {...props} />;

export default IconFont;
