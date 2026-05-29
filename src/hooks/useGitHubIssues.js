import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  fetchIssues,
  fetchIssue,
  parseIssueMeta,
  stripIssueMeta,
  hasLabel,
  getCategoryLabels,
} from '../services/github.js';
import { config } from '../data/config.js';

/**
 * 获取 Issues 列表的自定义 Hook
 * @param {string} label - Issue 标签名（如 'blog', 'project'）
 * @param {Object} options - 配置选项
 * @param {number} [options.pageSize=10] - 每页数量
 * @param {boolean} [options.filterDraft=true] - 是否过滤草稿
 * @param {boolean} [options.autoFetch=true] - 是否自动获取
 * @returns {Object} { issues, loading, error, loadMore, hasMore, refresh }
 */
export function useIssueList(label, options = {}) {
  const {
    pageSize = config.blog.pageSize || 10,
    filterDraft = true,
    autoFetch = true,
  } = options;

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // 组件卸载时标记为已卸载
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * 过滤草稿 Issues
   */
  const filterDraftIssues = useCallback(
    (issuesList) => {
      if (!filterDraft) return issuesList;
      const draftLabel = config.blog.draftLabel || 'draft';
      return issuesList.filter((issue) => !hasLabel(issue, draftLabel));
    },
    [filterDraft]
  );

  /**
   * 获取 Issues
   */
  const fetchIssuesList = useCallback(
    async (pageNum, isLoadMore = false) => {
      // 取消之前的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      if (!isLoadMore) {
        setLoading(true);
        setError(null);
      }

      try {
        const data = await fetchIssues(label, pageNum, pageSize);

        if (!isMountedRef.current) return;

        const filteredData = filterDraftIssues(data);

        if (isLoadMore) {
          setIssues((prev) => [...prev, ...filteredData]);
        } else {
          setIssues(filteredData);
        }

        // 判断是否还有更多数据
        setHasMore(data.length === pageSize);
        setPage(pageNum);
      } catch (err) {
        if (!isMountedRef.current) return;
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch issues');
          console.error('Error fetching issues:', err);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [label, pageSize, filterDraftIssues]
  );

  /**
   * 加载更多
   */
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchIssuesList(page + 1, true);
  }, [loading, hasMore, page, fetchIssuesList]);

  /**
   * 刷新列表
   */
  const refresh = useCallback(() => {
    setPage(1);
    setHasMore(true);
    fetchIssuesList(1, false);
  }, [fetchIssuesList]);

  // 自动获取
  useEffect(() => {
    if (autoFetch && label) {
      refresh();
    }
  }, [label, autoFetch, refresh]);

  return {
    issues,
    loading,
    error,
    loadMore,
    hasMore,
    refresh,
  };
}

/**
 * 获取单个 Issue 详情的自定义 Hook
 * @param {number|string} issueNumber - Issue 编号
 * @returns {Object} { issue, loading, error, refresh }
 */
export function useIssueDetail(issueNumber) {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchIssueDetail = useCallback(async () => {
    if (!issueNumber) return;

    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const data = await fetchIssue(issueNumber);

      if (!isMountedRef.current) return;

      setIssue(data);
    } catch (err) {
      if (!isMountedRef.current) return;
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch issue');
        console.error('Error fetching issue:', err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [issueNumber]);

  useEffect(() => {
    fetchIssueDetail();
  }, [fetchIssueDetail]);

  return {
    issue,
    loading,
    error,
    refresh: fetchIssueDetail,
  };
}

/**
 * 解析 Issue 内容的自定义 Hook
 * @param {Object} issue - Issue 对象
 * @param {string} systemLabel - 系统标签（如 'blog', 'project'）
 * @returns {Object} { meta, content, categories, title, createdAt, updatedAt, number }
 */
export function useParsedIssue(issue, systemLabel) {
  const parsed = useMemo(() => {
    if (!issue) {
      return {
        meta: {},
        content: '',
        categories: [],
        title: '',
        createdAt: '',
        updatedAt: '',
        number: null,
      };
    }

    const body = issue.body || '';
    const meta = parseIssueMeta(body);
    const content = stripIssueMeta(body);
    const categories = getCategoryLabels(issue, systemLabel);

    return {
      meta,
      content,
      categories,
      title: issue.title || '',
      createdAt: issue.created_at || '',
      updatedAt: issue.updated_at || '',
      number: issue.number,
    };
  }, [issue, systemLabel]);

  return parsed;
}
