import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function usePublishedArticles() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data: articles, error: fetchError } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (fetchError) throw fetchError;
        setData(articles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return { data, loading, error };
}

export function useArticleBySlug(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const fetchArticle = async () => {
      try {
        const { data: article, error: fetchError } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (fetchError) throw fetchError;
        setData(article);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  return { data, loading, error };
}

export function useAllArticles() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data: articles, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setData(articles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const save = async (article) => {
    try {
      const now = new Date().toISOString();
      const payload = {
        ...article,
        updated_at: now,
      };

      if (article.id) {
        const { error: updateError } = await supabase
          .from('articles')
          .update(payload)
          .eq('id', article.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('articles')
          .insert([{ ...payload, created_at: now }]);
        if (insertError) throw insertError;
      }
      await refetch();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;
      await refetch();
    } catch (err) {
      setError(err.message);
    }
  };

  return { data, loading, error, refetch, save, remove };
}
