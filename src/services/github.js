import axios from 'axios';
import { config } from '../data/config.js';

const { owner, repo } = config.github;
const BASE_URL = `https://api.github.com/repos/${owner}/${repo}`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
});

/**
 * 内存缓存，存储 API 响应数据
 * @type {Map<string, {data: any, timestamp: number}>}
 */
const cache = new Map();

/** 缓存 TTL 时间：5 分钟 (毫秒) */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * 从缓存获取数据，如果过期则返回 null
 * @param {string} key - 缓存键
 * @returns {any|null} 缓存的数据或 null
 */
function getFromCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * 将数据存入缓存
 * @param {string} key - 缓存键
 * @param {any} data - 要缓存的数据
 */
function setCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * 获取 Issues 列表，带 5 分钟 TTL 缓存
 * @param {string} label - Issue 标签名
 * @param {number} [page=1] - 页码
 * @param {number} [perPage=10] - 每页数量
 * @returns {Promise<Array>} Issues 数组
 */
export async function fetchIssues(label, page = 1, perPage = 10) {
  const cacheKey = `issues:${label}:${page}:${perPage}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await api.get('/issues', {
      params: {
        labels: label,
        state: 'open',
        page,
        per_page: perPage,
      },
    });

    const data = response.data;
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch issues with label "${label}":`, error.message);
    throw error;
  }
}

/**
 * 获取单个 Issue
 * @param {number} number - Issue 编号
 * @returns {Promise<Object>} Issue 对象
 */
export async function fetchIssue(number) {
  const cacheKey = `issue:${number}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await api.get(`/issues/${number}`);
    const data = response.data;
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch issue #${number}:`, error.message);
    throw error;
  }
}

/**
 * 解析 Issue body 中的元数据
 * 元数据格式：
 * <!-- meta
 * thumbnail: https://xxx.png
 * tech: React, FastAPI, Neo4j
 * demo: https://xxx.vercel.app
 * -->
 * @param {string} body - Issue body 内容
 * @returns {Object} 解析后的元数据对象
 */
export function parseIssueMeta(body) {
  if (!body) return {};

  const metaRegex = /<!--\s*meta\s*\n([\s\S]*?)\n-->/;
  const match = body.match(metaRegex);

  if (!match) return {};

  const metaBlock = match[1];
  const meta = {};

  metaBlock.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();

    if (key) {
      meta[key] = value;
    }
  });

  return meta;
}

/**
 * 移除 Issue body 中的元数据注释
 * @param {string} body - Issue body 内容
 * @returns {string} 移除元数据后的内容
 */
export function stripIssueMeta(body) {
  if (!body) return '';

  const metaRegex = /<!--\s*meta\s*\n[\s\S]*?\n-->\s*/;
  return body.replace(metaRegex, '').trim();
}

/**
 * 检查 Issue 是否包含指定的 label
 * @param {Object} issue - Issue 对象
 * @param {string} labelName - 标签名称
 * @returns {boolean} 是否包含该标签
 */
export function hasLabel(issue, labelName) {
  if (!issue || !issue.labels) return false;
  return issue.labels.some((label) => label.name === labelName);
}

/**
 * 获取 Issue 的分类标签（排除系统标签）
 * @param {Object} issue - Issue 对象
 * @param {string} systemLabel - 系统标签名称（如 'blog', 'project'）
 * @returns {Array<string>} 分类标签名称数组
 */
export function getCategoryLabels(issue, systemLabel) {
  if (!issue || !issue.labels) return [];

  return issue.labels
    .map((label) => label.name)
    .filter((name) => name !== systemLabel);
}

/**
 * 清除所有缓存
 */
export function clearCache() {
  cache.clear();
}
