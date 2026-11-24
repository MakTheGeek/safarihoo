import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  AttractionCategory,
  CmsContentGroup,
  DestinationCategory,
  ReviewCardStyle,
  ReviewCategory,
  SiteAttractionItem,
  SiteContentItem,
  SiteDestinationItem,
  SiteFileCategory,
  SiteFileItem,
  SiteLinkItem,
  SiteLinkPlacement,
  SiteReviewItem,
} from '../types';
import {
  DEFAULT_ATTRACTION_TOURS,
  DEFAULT_DESTINATIONS,
  DEFAULT_REVIEWS,
} from '../data/cmsDefaults';

export interface SaveContentPayload {
  key: string;
  en: string;
  fr: string;
  group: CmsContentGroup;
  label: string;
}

export interface SaveFilePayload {
  name: string;
  mimeType: string;
  category: SiteFileCategory;
  storageMode: 'inline' | 'external';
  dataUrl: string;
  externalUrl: string;
  sizeBytes: number;
  description: string;
}

export interface SaveLinkPayload {
  labelEn: string;
  labelFr: string;
  url: string;
  placement: SiteLinkPlacement;
  openInNewTab: boolean;
  active: boolean;
  order: number;
  description: string;
}

export interface SaveAttractionPayload {
  title: string;
  titleFr: string;
  price: number;
  description: string;
  descriptionFr: string;
  tag: string;
  tagFr: string;
  duration: string;
  durationFr: string;
  category: AttractionCategory;
  location: string;
  imageUrl: string;
  bookingUrl: string;
  highlights: string[];
  highlightsFr: string[];
  active: boolean;
  order: number;
}

export interface SaveDestinationPayload {
  title: string;
  titleFr: string;
  name: string;
  location: string;
  country: string;
  categories: DestinationCategory[];
  mainImage: string;
  thumbnails: string[];
  distance: string;
  temp: string;
  rating: string;
  price: string;
  tag: string;
  tagFr: string;
  description: string;
  descriptionFr: string;
  bookingUrl: string;
  active: boolean;
  order: number;
}

export interface SaveReviewPayload {
  name: string;
  role: string;
  roleFr: string;
  headline: string;
  headlineFr: string;
  text: string;
  textFr: string;
  rating: number;
  category: ReviewCategory;
  cardStyle: ReviewCardStyle;
  avatar: string;
  active: boolean;
  order: number;
}

interface CmsContextValue {
  contentItems: SiteContentItem[];
  contentMap: Record<string, SiteContentItem>;
  files: SiteFileItem[];
  links: SiteLinkItem[];
  storedAttractions: SiteAttractionItem[];
  attractions: SiteAttractionItem[];
  isUsingCustomAttractions: boolean;
  storedDestinations: SiteDestinationItem[];
  destinations: SiteDestinationItem[];
  isUsingCustomDestinations: boolean;
  storedReviews: SiteReviewItem[];
  reviews: SiteReviewItem[];
  isUsingCustomReviews: boolean;
  isLoading: boolean;
  isConnected: boolean;
  lastError: string | null;
  clearError: () => void;
  getContentText: (key: string, lang: 'EN' | 'FR', fallback: string) => string;
  saveContentItem: (payload: SaveContentPayload) => Promise<void>;
  deleteContentItem: (docId: string) => Promise<void>;
  addFileItem: (payload: SaveFilePayload) => Promise<string>;
  updateFileItem: (id: string, payload: SaveFilePayload) => Promise<void>;
  deleteFileItem: (id: string) => Promise<void>;
  addLinkItem: (payload: SaveLinkPayload) => Promise<string>;
  updateLinkItem: (id: string, payload: SaveLinkPayload) => Promise<void>;
  deleteLinkItem: (id: string) => Promise<void>;
  saveAttractionItem: (id: string | null, payload: SaveAttractionPayload) => Promise<string>;
  deleteAttractionItem: (id: string) => Promise<void>;
  importDefaultAttractions: () => Promise<void>;
  saveDestinationItem: (id: string | null, payload: SaveDestinationPayload) => Promise<string>;
  deleteDestinationItem: (id: string) => Promise<void>;
  importDefaultDestinations: () => Promise<void>;
  saveReviewItem: (id: string | null, payload: SaveReviewPayload) => Promise<string>;
  deleteReviewItem: (id: string) => Promise<void>;
  importDefaultReviews: () => Promise<void>;
}

const CmsContext = createContext<CmsContextValue | undefined>(undefined);

function slugDocId(raw: string): string {
  const cleaned = raw
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 120);
  if (cleaned.length > 0 && /^[a-zA-Z0-9_-]+$/.test(cleaned)) {
    return cleaned;
  }
  return `doc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeSafeHref(raw: string): string {
  const trimmed = raw.trim().slice(0, 2000);
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(trimmed)) {
    return `https://${trimmed}`;
  }
  throw new Error('URL invalide : doit commencer par https://, http://, /, #, mailto: ou tel:');
}

function sanitizeImageSrc(raw: string, maxLen = 750000): string {
  const trimmed = raw.trim().slice(0, maxLen);
  if (
    !trimmed ||
    !(
      trimmed.startsWith('https://') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('/') ||
      trimmed.startsWith('data:image/')
    )
  ) {
    throw new Error("L'URL de l'image doit commencer par https://, http://, / ou data:image/.");
  }
  return trimmed;
}

const VALID_DEST_CATEGORIES: DestinationCategory[] = ['Cities', 'Historic', 'Beach', 'Wonders'];

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contentItems, setContentItems] = useState<SiteContentItem[]>([]);
  const [files, setFiles] = useState<SiteFileItem[]>([]);
  const [links, setLinks] = useState<SiteLinkItem[]>([]);
  const [storedAttractions, setStoredAttractions] = useState<SiteAttractionItem[]>([]);
  const [storedDestinations, setStoredDestinations] = useState<SiteDestinationItem[]>([]);
  const [storedReviews, setStoredReviews] = useState<SiteReviewItem[]>([]);

  const [loadedFlags, setLoadedFlags] = useState({
    content: false,
    files: false,
    links: false,
    attractions: false,
    destinations: false,
    reviews: false,
  });
  const [isConnected, setIsConnected] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const unsubContent = onSnapshot(
      collection(db, 'site_content'),
      (snap) => {
        const list: SiteContentItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            key: String(data.key || ''),
            en: String(data.en || ''),
            fr: String(data.fr || ''),
            group: (data.group as CmsContentGroup) || 'custom',
            label: String(data.label || data.key || d.id),
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });
        list.sort((a, b) => a.key.localeCompare(b.key));
        setContentItems(list);
        setLoadedFlags((prev) => ({ ...prev, content: true }));
        setIsConnected(true);
      },
      (error) => {
        setIsConnected(false);
        setLastError(error.message);
        setLoadedFlags((prev) => ({ ...prev, content: true }));
        try {
          handleFirestoreError(error, OperationType.LIST, 'site_content');
        } catch {
          // Structured error logged
        }
      }
    );

    const unsubFiles = onSnapshot(
      collection(db, 'site_files'),
      (snap) => {
        const list: SiteFileItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: String(data.name || ''),
            mimeType: String(data.mimeType || 'application/octet-stream'),
            category: (data.category as SiteFileCategory) || 'asset',
            storageMode: (data.storageMode as 'inline' | 'external') || 'inline',
            dataUrl: String(data.dataUrl || ''),
            externalUrl: String(data.externalUrl || ''),
            sizeBytes: Number(data.sizeBytes || 0),
            description: String(data.description || ''),
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });
        list.sort((a, b) => a.name.localeCompare(b.name));
        setFiles(list);
        setLoadedFlags((prev) => ({ ...prev, files: true }));
        setIsConnected(true);
      },
      (error) => {
        setIsConnected(false);
        setLastError(error.message);
        setLoadedFlags((prev) => ({ ...prev, files: true }));
        try {
          handleFirestoreError(error, OperationType.LIST, 'site_files');
        } catch {
          // Structured error logged
        }
      }
    );

    const unsubLinks = onSnapshot(
      collection(db, 'site_links'),
      (snap) => {
        const list: SiteLinkItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            labelEn: String(data.labelEn || ''),
            labelFr: String(data.labelFr || ''),
            url: String(data.url || '#'),
            placement: (data.placement as SiteLinkPlacement) || 'footer_resources',
            openInNewTab: Boolean(data.openInNewTab),
            active: data.active !== false,
            order: Number.isFinite(Number(data.order)) ? Number(data.order) : 0,
            description: String(data.description || ''),
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });
        list.sort((a, b) => a.order - b.order || a.labelEn.localeCompare(b.labelEn));
        setLinks(list);
        setLoadedFlags((prev) => ({ ...prev, links: true }));
        setIsConnected(true);
      },
      (error) => {
        setIsConnected(false);
        setLastError(error.message);
        setLoadedFlags((prev) => ({ ...prev, links: true }));
        try {
          handleFirestoreError(error, OperationType.LIST, 'site_links');
        } catch {
          // Structured error logged
        }
      }
    );

    const unsubAttractions = onSnapshot(
      collection(db, 'site_attractions'),
      (snap) => {
        const list: SiteAttractionItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: String(data.title || ''),
            titleFr: String(data.titleFr || ''),
            price: Number(data.price || 0),
            description: String(data.description || ''),
            descriptionFr: String(data.descriptionFr || ''),
            tag: String(data.tag || 'tour'),
            tagFr: String(data.tagFr || 'circuit'),
            duration: String(data.duration || '1 day'),
            durationFr: String(data.durationFr || '1 jour'),
            category: (data.category as AttractionCategory) || 'Adventure',
            location: String(data.location || 'Nepal'),
            imageUrl: String(data.imageUrl || ''),
            bookingUrl: String(data.bookingUrl || ''),
            highlights: Array.isArray(data.highlights) ? data.highlights.map(String) : [],
            highlightsFr: Array.isArray(data.highlightsFr) ? data.highlightsFr.map(String) : [],
            active: data.active !== false,
            order: Number.isFinite(Number(data.order)) ? Number(data.order) : 0,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });
        list.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
        setStoredAttractions(list);
        setLoadedFlags((prev) => ({ ...prev, attractions: true }));
        setIsConnected(true);
      },
      (error) => {
        setIsConnected(false);
        setLastError(error.message);
        setLoadedFlags((prev) => ({ ...prev, attractions: true }));
        try {
          handleFirestoreError(error, OperationType.LIST, 'site_attractions');
        } catch {
          // Structured error logged
        }
      }
    );

    const unsubDestinations = onSnapshot(
      collection(db, 'site_destinations'),
      (snap) => {
        const list: SiteDestinationItem[] = snap.docs.map((d) => {
          const data = d.data();
          const rawCats = Array.isArray(data.categories) ? data.categories.map(String) : ['Cities'];
          const cats = rawCats.filter((c): c is DestinationCategory =>
            VALID_DEST_CATEGORIES.includes(c as DestinationCategory)
          );
          const rawThumbs = Array.isArray(data.thumbnails)
            ? data.thumbnails.map(String).filter(Boolean)
            : [];
          const mainImage = String(data.mainImage || '');
          return {
            id: d.id,
            title: String(data.title || ''),
            titleFr: String(data.titleFr || ''),
            name: String(data.name || ''),
            location: String(data.location || ''),
            country: String(data.country || ''),
            categories: cats.length > 0 ? cats : ['Cities'],
            mainImage,
            thumbnails: rawThumbs.length > 0 ? rawThumbs : mainImage ? [mainImage] : [],
            distance: String(data.distance || '1,000Km'),
            temp: String(data.temp || '24° C'),
            rating: String(data.rating || '4.9'),
            price: String(data.price || '$990'),
            tag: String(data.tag || ''),
            tagFr: String(data.tagFr || ''),
            description: String(data.description || ''),
            descriptionFr: String(data.descriptionFr || ''),
            bookingUrl: String(data.bookingUrl || ''),
            active: data.active !== false,
            order: Number.isFinite(Number(data.order)) ? Number(data.order) : 0,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });
        list.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
        setStoredDestinations(list);
        setLoadedFlags((prev) => ({ ...prev, destinations: true }));
        setIsConnected(true);
      },
      (error) => {
        setIsConnected(false);
        setLastError(error.message);
        setLoadedFlags((prev) => ({ ...prev, destinations: true }));
        try {
          handleFirestoreError(error, OperationType.LIST, 'site_destinations');
        } catch {
          // Structured error logged
        }
      }
    );

    const unsubReviews = onSnapshot(
      collection(db, 'site_reviews'),
      (snap) => {
        const list: SiteReviewItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: String(data.name || ''),
            role: String(data.role || ''),
            roleFr: String(data.roleFr || ''),
            headline: String(data.headline || ''),
            headlineFr: String(data.headlineFr || ''),
            text: String(data.text || ''),
            textFr: String(data.textFr || ''),
            rating: Math.max(1, Math.min(5, Math.round(Number(data.rating) || 5))),
            category: (data.category as ReviewCategory) || 'flights',
            cardStyle: (data.cardStyle as ReviewCardStyle) || 'quote-top',
            avatar: String(data.avatar || ''),
            active: data.active !== false,
            order: Number.isFinite(Number(data.order)) ? Number(data.order) : 0,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });
        list.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
        setStoredReviews(list);
        setLoadedFlags((prev) => ({ ...prev, reviews: true }));
        setIsConnected(true);
      },
      (error) => {
        setIsConnected(false);
        setLastError(error.message);
        setLoadedFlags((prev) => ({ ...prev, reviews: true }));
        try {
          handleFirestoreError(error, OperationType.LIST, 'site_reviews');
        } catch {
          // Structured error logged
        }
      }
    );

    const loadingSafetyTimer = setTimeout(() => {
      setLoadedFlags({
        content: true,
        files: true,
        links: true,
        attractions: true,
        destinations: true,
        reviews: true,
      });
    }, 8000);

    return () => {
      clearTimeout(loadingSafetyTimer);
      unsubContent();
      unsubFiles();
      unsubLinks();
      unsubAttractions();
      unsubDestinations();
      unsubReviews();
    };
  }, []);

  const contentMap = useMemo(() => {
    const map: Record<string, SiteContentItem> = {};
    for (const item of contentItems) {
      map[item.key] = item;
    }
    return map;
  }, [contentItems]);

  const activeStoredAttractions = useMemo(
    () => storedAttractions.filter((t) => t.active !== false),
    [storedAttractions]
  );
  const isUsingCustomAttractions = storedAttractions.length > 0;
  const attractions = isUsingCustomAttractions ? activeStoredAttractions : DEFAULT_ATTRACTION_TOURS;

  const activeStoredDestinations = useMemo(
    () => storedDestinations.filter((d) => d.active !== false),
    [storedDestinations]
  );
  const isUsingCustomDestinations = storedDestinations.length > 0;
  const destinations = isUsingCustomDestinations
    ? activeStoredDestinations
    : DEFAULT_DESTINATIONS;

  const activeStoredReviews = useMemo(
    () => storedReviews.filter((r) => r.active !== false),
    [storedReviews]
  );
  const isUsingCustomReviews = storedReviews.length > 0;
  const reviews = isUsingCustomReviews ? activeStoredReviews : DEFAULT_REVIEWS;

  const isLoading =
    !loadedFlags.content ||
    !loadedFlags.files ||
    !loadedFlags.links ||
    !loadedFlags.attractions ||
    !loadedFlags.destinations ||
    !loadedFlags.reviews;

  const getContentText = (key: string, lang: 'EN' | 'FR', fallback: string): string => {
    const override = contentMap[key];
    if (!override) return fallback;
    const candidate = lang === 'FR' ? override.fr : override.en;
    return candidate && candidate.length > 0 ? candidate : fallback;
  };

  // --- CRUD: Site Content ---
  const saveContentItem = async (payload: SaveContentPayload): Promise<void> => {
    const cleanKey = payload.key.trim().slice(0, 80);
    if (!/^[a-zA-Z0-9._-]+$/.test(cleanKey)) {
      throw new Error('Clé invalide : utilisez uniquement lettres, chiffres, points, tirets.');
    }
    const docId = slugDocId(cleanKey);
    const existing = contentMap[cleanKey];
    const path = `site_content/${docId}`;

    const sanitized = {
      key: cleanKey,
      en: payload.en.slice(0, 2000),
      fr: payload.fr.slice(0, 2000),
      group: payload.group,
      label: (payload.label.trim() || cleanKey).slice(0, 120),
    };

    try {
      if (existing && existing.id === docId) {
        await updateDoc(doc(db, 'site_content', docId), {
          ...sanitized,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, 'site_content', docId), {
          ...sanitized,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      setLastError(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, existing ? OperationType.UPDATE : OperationType.CREATE, path);
    }
  };

  const deleteContentItem = async (docId: string): Promise<void> => {
    const path = `site_content/${docId}`;
    try {
      await deleteDoc(doc(db, 'site_content', docId));
    } catch (error) {
      setLastError(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  // --- CRUD: Site Files ---
  const validateFilePayload = (payload: SaveFilePayload): SaveFilePayload => {
    const name = payload.name.trim().slice(0, 160);
    if (!name) throw new Error('Le nom du fichier est requis.');
    const mimeType = (payload.mimeType.trim() || 'application/octet-stream').slice(0, 120);
    const description = payload.description.trim().slice(0, 500);
    const sizeBytes = Math.max(0, Math.min(50000000, Math.round(payload.sizeBytes || 0)));

    if (payload.storageMode === 'inline') {
      if (!payload.dataUrl || !payload.dataUrl.startsWith('data:')) {
        throw new Error('Contenu base64 invalide.');
      }
      if (payload.dataUrl.length > 750000) {
        throw new Error(
          'Fichier trop volumineux pour le stockage direct Firestore (max ~540 Ko en binaire). Utilisez une image plus légère ou une URL externe.'
        );
      }
      return {
        name,
        mimeType,
        category: payload.category,
        storageMode: 'inline',
        dataUrl: payload.dataUrl,
        externalUrl: '',
        sizeBytes,
        description,
      };
    } else {
      const safeExternal = sanitizeSafeHref(payload.externalUrl);
      return {
        name,
        mimeType,
        category: payload.category,
        storageMode: 'external',
        dataUrl: '',
        externalUrl: safeExternal,
        sizeBytes,
        description,
      };
    }
  };

  const addFileItem = async (payload: SaveFilePayload): Promise<string> => {
    const clean = validateFilePayload(payload);
    const id = generateId('file');
    const path = `site_files/${id}`;
    try {
      await setDoc(doc(db, 'site_files', id), {
        ...clean,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return id;
    } catch (error) {
      setLastError(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateFileItem = async (id: string, payload: SaveFilePayload): Promise<void> => {
    const clean = validateFilePayload(payload);
    const path = `site_files/${id}`;
    try {
      await updateDoc(doc(db, 'site_files', id), {
        ...clean,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      setLastError(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteFileItem = async (id: string): Promise<void> => {
    const path = `site_files/${id}`;
    try {
      await deleteDoc(doc(db, 'site_files', id));
    } catch (error) {
      setLastError(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  // --- CRUD: Site Links ---
  const validateLinkPayload = (payload: SaveLinkPayload): SaveLinkPayload => {
    const labelEn = payload.labelEn.trim().slice(0, 100);
    const labelFr = (payload.labelFr.trim() || labelEn).slice(0, 100);
    if (!labelEn) throw new Error('Le libellé du lien (EN) est requis.');
    const url = sanitizeSafeHref(payload.url);
    return {
      labelEn,
      labelFr,
      url,
      placement: payload.placement,
      openInNewTab: Boolean(payload.openInNewTab),
      active: Boolean(payload.active),
      order: Math.max(0, Math.min(10000, Math.round(Number(payload.order) || 0))),
      description: payload.description.trim().slice(0, 300),
    };
  };

  const addLinkItem = async (payload: SaveLinkPayload): Promise<string> => {
    const clean = validateLinkPayload(payload);
    const id = generateId('link');
    const path = `site_links/${id}`;
    try {
      await setDoc(doc(db, 'site_links', id), {
        ...clean,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return id;
    } catch (error) {
      setLastError(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateLinkItem = async (id: string, payload: SaveLinkPayload): Promise<void> => {
    const clean = validateLinkPayload(payload);
    const path = `site_links/${id}`;
    try {
      await updateDoc(doc(db, 'site_links', id), {
        ...clean,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      setLastError(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteLinkItem = async (id: string): Promise<void> => {
    const path = `site_links/${id}`;
    try {
      await deleteDoc(doc(db, 'site_links', id));
    } catch (error) {
      setLastError(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  // --- CRUD: Site Attractions ---
  const validateAttractionPayload = (payload: SaveAttractionPayload): SaveAttractionPayload => {
    const title = payload.title.trim().slice(0, 120);
    const titleFr = (payload.titleFr.trim() || title).slice(0, 120);
    if (!title) throw new Error('Le titre du circuit (EN) est requis.');

    const description = payload.description.trim().slice(0, 600);
    const descriptionFr = (payload.descriptionFr.trim() || description).slice(0, 600);
    if (!description) throw new Error('La description est requise.');

    const imageUrl = sanitizeImageSrc(payload.imageUrl);
    const bookingUrl = payload.bookingUrl.trim() ? sanitizeSafeHref(payload.bookingUrl) : '';

    return {
      title,
      titleFr,
      price: Math.max(0, Math.min(1000000, Number(payload.price) || 0)),
      description,
      descriptionFr,
      tag: (payload.tag.trim() || 'tour').slice(0, 50),
      tagFr: (payload.tagFr.trim() || 'circuit').slice(0, 50),
      duration: (payload.duration.trim() || '3 days').slice(0, 50),
      durationFr: (payload.durationFr.trim() || '3 jours').slice(0, 50),
      category: payload.category,
      location: (payload.location.trim() || 'Nepal').slice(0, 120),
      imageUrl,
      bookingUrl,
      highlights: payload.highlights
        .map((h) => h.trim().slice(0, 200))
        .filter(Boolean)
        .slice(0, 8),
      highlightsFr: payload.highlightsFr
        .map((h) => h.trim().slice(0, 200))
        .filter(Boolean)
        .slice(0, 8),
      active: Boolean(payload.active),
      order: Math.max(0, Math.min(10000, Math.round(Number(payload.order) || 0))),
    };
  };

  const saveAttractionItem = async (
    id: string | null,
    payload: SaveAttractionPayload
  ): Promise<string> => {
    const clean = validateAttractionPayload(payload);
    const docId = id ? slugDocId(id) : generateId('tour');
    const exists = storedAttractions.some((t) => t.id === docId);
    const path = `site_attractions/${docId}`;

    try {
      if (exists) {
        await updateDoc(doc(db, 'site_attractions', docId), {
          ...clean,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, 'site_attractions', docId), {
          ...clean,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      return docId;
    } catch (error) {
      setLastError(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, exists ? OperationType.UPDATE : OperationType.CREATE, path);
    }
  };

  const deleteAttractionItem = async (id: string): Promise<void> => {
    const path = `site_attractions/${id}`;
    try {
      await deleteDoc(doc(db, 'site_attractions', id));
    } catch (error) {
      setLastError(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const importDefaultAttractions = async (): Promise<void> => {
    for (const tour of DEFAULT_ATTRACTION_TOURS) {
      await saveAttractionItem(tour.id, {
        title: tour.title,
        titleFr: tour.titleFr,
        price: tour.price,
        description: tour.description,
        descriptionFr: tour.descriptionFr,
        tag: tour.tag,
        tagFr: tour.tagFr,
        duration: tour.duration,
        durationFr: tour.durationFr,
        category: tour.category,
        location: tour.location,
        imageUrl: tour.imageUrl,
        bookingUrl: tour.bookingUrl,
        highlights: tour.highlights,
        highlightsFr: tour.highlightsFr,
        active: tour.active,
        order: tour.order,
      });
    }
  };

  // --- CRUD: Site Destinations ---
  const validateDestinationPayload = (
    payload: SaveDestinationPayload
  ): SaveDestinationPayload => {
    const name = payload.name.trim().slice(0, 80);
    if (!name) throw new Error('Le nom de la destination est requis.');

    const title = (payload.title.trim() || name).slice(0, 120);
    const titleFr = (payload.titleFr.trim() || title).slice(0, 120);
    const location = (payload.location.trim() || name).slice(0, 120);
    const country = (payload.country.trim() || location).slice(0, 80);

    const categories = payload.categories
      .filter((c): c is DestinationCategory => VALID_DEST_CATEGORIES.includes(c))
      .slice(0, 4);
    if (categories.length === 0) categories.push('Cities');

    const mainImage = sanitizeImageSrc(payload.mainImage);

    const rawThumbs = payload.thumbnails
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 6);
    const thumbnails = (rawThumbs.length > 0 ? rawThumbs : [mainImage]).map((src) =>
      sanitizeImageSrc(src, 120000)
    );

    const description = payload.description.trim().slice(0, 600);
    if (!description) throw new Error('La description (EN) est requise.');
    const descriptionFr = (payload.descriptionFr.trim() || description).slice(0, 600);

    const bookingUrl = payload.bookingUrl.trim() ? sanitizeSafeHref(payload.bookingUrl) : '';

    return {
      title,
      titleFr,
      name,
      location,
      country,
      categories,
      mainImage,
      thumbnails,
      distance: (payload.distance.trim() || '1,200Km').slice(0, 40),
      temp: (payload.temp.trim() || '24° C').slice(0, 30),
      rating: (payload.rating.trim() || '4.9').slice(0, 16),
      price: (payload.price.trim() || '$990').slice(0, 32),
      tag: payload.tag.trim().slice(0, 40),
      tagFr: payload.tagFr.trim().slice(0, 40),
      description,
      descriptionFr,
      bookingUrl,
      active: Boolean(payload.active),
      order: Math.max(0, Math.min(10000, Math.round(Number(payload.order) || 0))),
    };
  };

  const saveDestinationItem = async (
    id: string | null,
    payload: SaveDestinationPayload
  ): Promise<string> => {
    const clean = validateDestinationPayload(payload);
    const docId = id ? slugDocId(id) : generateId('dest');
    const exists = storedDestinations.some((d) => d.id === docId);
    const path = `site_destinations/${docId}`;

    try {
      if (exists) {
        await updateDoc(doc(db, 'site_destinations', docId), {
          ...clean,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, 'site_destinations', docId), {
          ...clean,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      return docId;
    } catch (error) {
      setLastError(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, exists ? OperationType.UPDATE : OperationType.CREATE, path);
    }
  };

  const deleteDestinationItem = async (id: string): Promise<void> => {
    const path = `site_destinations/${id}`;
    try {
      await deleteDoc(doc(db, 'site_destinations', id));
    } catch (error) {
      setLastError(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const importDefaultDestinations = async (): Promise<void> => {
    for (const dest of DEFAULT_DESTINATIONS) {
      await saveDestinationItem(dest.id, {
        title: dest.title,
        titleFr: dest.titleFr,
        name: dest.name,
        location: dest.location,
        country: dest.country,
        categories: dest.categories,
        mainImage: dest.mainImage,
        thumbnails: dest.thumbnails,
        distance: dest.distance,
        temp: dest.temp,
        rating: dest.rating,
        price: dest.price,
        tag: dest.tag,
        tagFr: dest.tagFr,
        description: dest.description,
        descriptionFr: dest.descriptionFr,
        bookingUrl: dest.bookingUrl,
        active: dest.active,
        order: dest.order,
      });
    }
  };

  // --- CRUD: Site Reviews ---
  const validateReviewPayload = (payload: SaveReviewPayload): SaveReviewPayload => {
    const name = payload.name.trim().slice(0, 100);
    if (!name) throw new Error("Le nom de l'auteur est requis.");

    const text = payload.text.trim().slice(0, 800);
    if (!text) throw new Error("Le texte de l'avis (EN) est requis.");
    const textFr = (payload.textFr.trim() || text).slice(0, 800);

    const avatar = sanitizeImageSrc(
      payload.avatar.trim() ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    );

    return {
      name,
      role: payload.role.trim().slice(0, 120),
      roleFr: (payload.roleFr.trim() || payload.role.trim()).slice(0, 120),
      headline: payload.headline.trim().slice(0, 120),
      headlineFr: (payload.headlineFr.trim() || payload.headline.trim()).slice(0, 120),
      text,
      textFr,
      rating: Math.max(1, Math.min(5, Math.round(Number(payload.rating) || 5))),
      category: payload.category,
      cardStyle: payload.cardStyle,
      avatar,
      active: Boolean(payload.active),
      order: Math.max(0, Math.min(10000, Math.round(Number(payload.order) || 0))),
    };
  };

  const saveReviewItem = async (
    id: string | null,
    payload: SaveReviewPayload
  ): Promise<string> => {
    const clean = validateReviewPayload(payload);
    const docId = id ? slugDocId(id) : generateId('review');
    const exists = storedReviews.some((r) => r.id === docId);
    const path = `site_reviews/${docId}`;

    try {
      if (exists) {
        await updateDoc(doc(db, 'site_reviews', docId), {
          ...clean,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, 'site_reviews', docId), {
          ...clean,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      return docId;
    } catch (error) {
      setLastError(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, exists ? OperationType.UPDATE : OperationType.CREATE, path);
    }
  };

  const deleteReviewItem = async (id: string): Promise<void> => {
    const path = `site_reviews/${id}`;
    try {
      await deleteDoc(doc(db, 'site_reviews', id));
    } catch (error) {
      setLastError(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const importDefaultReviews = async (): Promise<void> => {
    for (const review of DEFAULT_REVIEWS) {
      await saveReviewItem(review.id, {
        name: review.name,
        role: review.role,
        roleFr: review.roleFr,
        headline: review.headline,
        headlineFr: review.headlineFr,
        text: review.text,
        textFr: review.textFr,
        rating: review.rating,
        category: review.category,
        cardStyle: review.cardStyle,
        avatar: review.avatar,
        active: review.active,
        order: review.order,
      });
    }
  };

  return (
    <CmsContext.Provider
      value={{
        contentItems,
        contentMap,
        files,
        links,
        storedAttractions,
        attractions,
        isUsingCustomAttractions,
        storedDestinations,
        destinations,
        isUsingCustomDestinations,
        storedReviews,
        reviews,
        isUsingCustomReviews,
        isLoading,
        isConnected,
        lastError,
        clearError: () => setLastError(null),
        getContentText,
        saveContentItem,
        deleteContentItem,
        addFileItem,
        updateFileItem,
        deleteFileItem,
        addLinkItem,
        updateLinkItem,
        deleteLinkItem,
        saveAttractionItem,
        deleteAttractionItem,
        importDefaultAttractions,
        saveDestinationItem,
        deleteDestinationItem,
        importDefaultDestinations,
        saveReviewItem,
        deleteReviewItem,
        importDefaultReviews,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = (): CmsContextValue => {
  const ctx = useContext(CmsContext);
  if (!ctx) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return ctx;
};
