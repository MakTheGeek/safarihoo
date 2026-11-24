import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Link2,
  Compass,
  Plus,
  Search,
  Trash2,
  Edit3,
  Download,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  Upload,
  ArrowLeft,
  AlertCircle,
  Menu,
  X,
  File as FileIcon,
  Save,
  Sparkles,
  Globe,
  Star,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { useLanguage } from '../context/LanguageContext';
import { EDITABLE_CONTENT_FIELDS } from '../data/cmsDefaults';
import {
  AttractionCategory,
  CmsContentGroup,
  DestinationCategory,
  ReviewCardStyle,
  ReviewCategory,
  SiteAttractionItem,
  SiteDestinationItem,
  SiteFileCategory,
  SiteFileItem,
  SiteLinkItem,
  SiteLinkPlacement,
  SiteReviewItem,
} from '../types';

type AdminTab =
  | 'overview'
  | 'content'
  | 'destinations'
  | 'reviews'
  | 'attractions'
  | 'files'
  | 'links'
  | 'security';

interface AdminPanelProps {
  onExitAdmin: () => void;
}

const PLACEMENT_LABELS: Record<SiteLinkPlacement, { en: string; fr: string }> = {
  header: { en: 'Top Header Menu', fr: 'Barre de menu (Header)' },
  footer_company: { en: 'Footer — Company', fr: 'Footer — Entreprise' },
  footer_services: { en: 'Footer — Services', fr: 'Footer — Services' },
  footer_resources: { en: 'Footer — Resources', fr: 'Footer — Ressources' },
  footer_legal: { en: 'Footer — Legal', fr: 'Footer — Légal' },
  custom_bar: { en: 'Quick Links Strip (Public)', fr: 'Bandeau Liens Rapides (Public)' },
};

const GROUP_LABELS: Record<CmsContentGroup, { en: string; fr: string }> = {
  hero: { en: 'Flights Hero', fr: 'Hero Vols' },
  hotels: { en: 'Hotels & Attractions Hero', fr: 'Hero Hôtels & Attractions' },
  attractions: { en: 'Attractions Editorial', fr: 'Éditorial Attractions' },
  destinations: { en: 'Best Destinations Copy', fr: 'Textes Best Destinations' },
  reviews: { en: 'Reviews Section Copy', fr: 'Textes Avis Voyageurs' },
  cars: { en: 'Cars Hero', fr: 'Hero Voitures' },
  airhelp: { en: 'AirHelp Hero', fr: 'Hero AirHelp' },
  trust: { en: 'Trust Badges', fr: 'Badges Confiance' },
  about: { en: 'About Us Page', fr: 'Page À propos' },
  faq: { en: 'FAQ Page', fr: 'Page FAQ' },
  contact: { en: 'Contact Info', fr: 'Infos Contact' },
  footer: { en: 'Footer Copy', fr: 'Textes Footer' },
  custom: { en: 'Custom Keys', fr: 'Champs Personnalisés' },
};

const DEST_CATEGORIES: DestinationCategory[] = ['Cities', 'Historic', 'Beach', 'Wonders'];

const REVIEW_CARD_STYLES: { value: ReviewCardStyle; labelEn: string; labelFr: string }[] = [
  { value: 'quote-top', labelEn: 'Quote Badge + Bottom Author', labelFr: 'Badge Citation + Auteur en bas' },
  { value: 'avatar-top-stars', labelEn: 'Top Avatar + 5 Stars + Headline', labelFr: 'Avatar en haut + Étoiles + Titre' },
  { value: 'headline-stars', labelEn: 'Centered Headline + Stars', labelFr: 'Titre centré + Étoiles' },
  { value: 'quote-bottom-avatar', labelEn: 'Left Quote + Bottom Avatar', labelFr: 'Citation gauche + Avatar en bas' },
  { value: 'cursive-signature', labelEn: 'Stars + Cursive Signature', labelFr: 'Étoiles + Signature manuscrite' },
  { value: 'headline-avatars', labelEn: 'Headline + Group Avatars', labelFr: 'Titre + Groupe d’avatars' },
];

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function compressImageToDataUrl(file: File, maxDimension = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        let dataUrl = canvas.toDataURL(outputMime, quality);
        if (dataUrl.length > 720000) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.65);
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Impossible de lire le fichier image'));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsDataURL(file);
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsDataURL(file);
  });
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExitAdmin }) => {
  const { language, setLanguage } = useLanguage();
  const isFr = language === 'FR';

  const {
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
    clearError,
    saveContentItem,
    deleteContentItem,
    addFileItem,
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
  } = useCms();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  // Content Editor state
  const [contentSearch, setContentSearch] = useState('');
  const [contentGroupFilter, setContentGroupFilter] = useState<'all' | CmsContentGroup>('all');
  const [editingContentKey, setEditingContentKey] = useState<string | null>(null);
  const [contentDraft, setContentDraft] = useState<{
    key: string;
    label: string;
    group: CmsContentGroup;
    en: string;
    fr: string;
  } | null>(null);
  const [showNewContentModal, setShowNewContentModal] = useState(false);

  // Files state
  const [fileSearch, setFileSearch] = useState('');
  const [fileCategoryFilter, setFileCategoryFilter] = useState<'all' | SiteFileCategory>('all');
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileMode, setFileMode] = useState<'upload' | 'external'>('upload');
  const [fileForm, setFileForm] = useState({
    name: '',
    mimeType: 'image/jpeg',
    category: 'image' as SiteFileCategory,
    externalUrl: '',
    dataUrl: '',
    sizeBytes: 0,
    description: '',
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Links state
  const [linkSearch, setLinkSearch] = useState('');
  const [linkPlacementFilter, setLinkPlacementFilter] = useState<'all' | SiteLinkPlacement>('all');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [linkForm, setLinkForm] = useState({
    labelEn: '',
    labelFr: '',
    url: '',
    placement: 'footer_resources' as SiteLinkPlacement,
    openInNewTab: true,
    active: true,
    order: 0,
    description: '',
  });

  // Attractions state
  const [attractionSearch, setAttractionSearch] = useState('');
  const [showAttractionModal, setShowAttractionModal] = useState(false);
  const [editingAttractionId, setEditingAttractionId] = useState<string | null>(null);
  const [attractionForm, setAttractionForm] = useState({
    title: '',
    titleFr: '',
    price: 750,
    description: '',
    descriptionFr: '',
    tag: 'popular',
    tagFr: 'populaire',
    duration: '5 days',
    durationFr: '5 jours',
    category: 'Adventure' as AttractionCategory,
    location: 'Nepal',
    imageUrl: '',
    bookingUrl: '',
    highlightsText: '',
    highlightsFrText: '',
    active: true,
    order: 0,
  });

  // Destinations state
  const [destSearch, setDestSearch] = useState('');
  const [showDestModal, setShowDestModal] = useState(false);
  const [editingDestId, setEditingDestId] = useState<string | null>(null);
  const [destForm, setDestForm] = useState({
    name: '',
    title: '',
    titleFr: '',
    location: '',
    country: '',
    categories: ['Cities'] as DestinationCategory[],
    mainImage: '',
    thumbnailsText: '',
    distance: '1,200Km',
    temp: '24° C',
    rating: '4.9',
    price: '$1,190',
    tag: 'Trending',
    tagFr: 'Tendance',
    description: '',
    descriptionFr: '',
    bookingUrl: '',
    active: true,
    order: 0,
  });

  // Reviews state
  const [reviewSearch, setReviewSearch] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    role: '',
    roleFr: '',
    headline: '',
    headlineFr: '',
    text: '',
    textFr: '',
    rating: 5,
    category: 'flights' as ReviewCategory,
    cardStyle: 'quote-top' as ReviewCardStyle,
    avatar: '',
    active: true,
    order: 0,
  });

  // Password Lock state (Bearer token strictly kept in React memory, never in localStorage)
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [lockChecking, setLockChecking] = useState(true);
  const [lockServerUnavailable, setLockServerUnavailable] = useState(false);
  const [lockStatus, setLockStatus] = useState({
    locked: false,
    hasPassword: false,
    managedByEnv: false,
    authenticated: true,
  });
  const [unlockPasswordInput, setUnlockPasswordInput] = useState('');
  const [showUnlockPassword, setShowUnlockPassword] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockBusy, setUnlockBusy] = useState(false);

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showSecurityPasswords, setShowSecurityPasswords] = useState(false);

  const [lockServerError, setLockServerError] = useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/admin/auth/status', {
          cache: 'no-store',
        });
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json') || res.status === 404) {
          if (active) setLockServerUnavailable(true);
          return;
        }
        const data = (await res.json()) as Partial<typeof lockStatus> & { error?: string };
        if (!res.ok) {
          if (active) {
            setLockServerUnavailable(false);
            setLockServerError(data.error || 'Auth server error');
          }
          return;
        }
        if (active) {
          setLockServerUnavailable(false);
          setLockServerError(null);
          setLockStatus({
            locked: Boolean(data.locked),
            hasPassword: Boolean(data.hasPassword),
            managedByEnv: Boolean(data.managedByEnv),
            authenticated: Boolean(data.authenticated),
          });
        }
      } catch {
        if (active) setLockServerUnavailable(true);
      } finally {
        if (active) setLockChecking(false);
      }
    };
    void checkStatus();
    return () => {
      active = false;
    };
  }, []);

  const notify = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    if (type === 'success') {
      setTimeout(() => {
        setStatusMessage((prev) => (prev?.text === text ? null : prev));
      }, 4000);
    }
  };

  // Merge known content fields + any custom Firestore keys
  const mergedContentRows = useMemo(() => {
    const knownKeys = new Set(EDITABLE_CONTENT_FIELDS.map((f) => f.key));
    const baseRows = EDITABLE_CONTENT_FIELDS.map((field) => {
      const stored = contentMap[field.key];
      return {
        key: field.key,
        group: field.group,
        label: field.label,
        en: stored?.en ?? field.defaultEn,
        fr: stored?.fr ?? field.defaultFr,
        isOverridden: Boolean(stored),
        docId: stored?.id ?? null,
      };
    });
    const customRows = contentItems
      .filter((item) => !knownKeys.has(item.key))
      .map((item) => ({
        key: item.key,
        group: item.group,
        label: item.label,
        en: item.en,
        fr: item.fr,
        isOverridden: true,
        docId: item.id,
      }));
    return [...baseRows, ...customRows];
  }, [contentItems, contentMap]);

  const filteredContentRows = useMemo(() => {
    const q = contentSearch.trim().toLowerCase();
    return mergedContentRows.filter((row) => {
      if (contentGroupFilter !== 'all' && row.group !== contentGroupFilter) return false;
      if (!q) return true;
      return (
        row.key.toLowerCase().includes(q) ||
        row.label.toLowerCase().includes(q) ||
        row.en.toLowerCase().includes(q) ||
        row.fr.toLowerCase().includes(q)
      );
    });
  }, [mergedContentRows, contentSearch, contentGroupFilter]);

  const filteredFiles = useMemo(() => {
    const q = fileSearch.trim().toLowerCase();
    return files.filter((f) => {
      if (fileCategoryFilter !== 'all' && f.category !== fileCategoryFilter) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.mimeType.toLowerCase().includes(q)
      );
    });
  }, [files, fileSearch, fileCategoryFilter]);

  const filteredLinks = useMemo(() => {
    const q = linkSearch.trim().toLowerCase();
    return links.filter((l) => {
      if (linkPlacementFilter !== 'all' && l.placement !== linkPlacementFilter) return false;
      if (!q) return true;
      return (
        l.labelEn.toLowerCase().includes(q) ||
        l.labelFr.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q)
      );
    });
  }, [links, linkSearch, linkPlacementFilter]);

  const filteredAttractions = useMemo(() => {
    const list = isUsingCustomAttractions ? storedAttractions : attractions;
    const q = attractionSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.titleFr.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q)
    );
  }, [isUsingCustomAttractions, storedAttractions, attractions, attractionSearch]);

  const filteredDestinations = useMemo(() => {
    const list = isUsingCustomDestinations ? storedDestinations : destinations;
    const q = destSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q) ||
        d.titleFr.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q)
    );
  }, [isUsingCustomDestinations, storedDestinations, destinations, destSearch]);

  const filteredReviews = useMemo(() => {
    const list = isUsingCustomReviews ? storedReviews : reviews;
    const q = reviewSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q) ||
        r.textFr.toLowerCase().includes(q) ||
        r.headline.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [isUsingCustomReviews, storedReviews, reviews, reviewSearch]);

  const totalStorageBytes = useMemo(
    () => files.reduce((acc, f) => acc + (f.sizeBytes || 0), 0),
    [files]
  );

  // Handlers
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentDraft) return;
    setBusyAction('save-content');
    try {
      await saveContentItem(contentDraft);
      setEditingContentKey(null);
      setShowNewContentModal(false);
      setContentDraft(null);
      notify('success', isFr ? 'Contenu mis à jour dans Firebase.' : 'Content saved to Firebase.');
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleResetContent = async (docId: string) => {
    setBusyAction(`reset-${docId}`);
    try {
      await deleteContentItem(docId);
      notify('success', isFr ? 'Texte réinitialisé par défaut.' : 'Text restored to default.');
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Erreur lors de la réinitialisation.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setBusyAction('process-file');
    try {
      const isImage = picked.type.startsWith('image/');
      let dataUrl = '';
      if (isImage) {
        dataUrl = await compressImageToDataUrl(picked);
      } else {
        dataUrl = await readFileAsDataUrl(picked);
      }

      if (dataUrl.length > 740000) {
        notify(
          'error',
          isFr
            ? 'Ce fichier dépasse ~540 Ko après encodage. Utilisez le mode "URL Externe" pour les fichiers lourds.'
            : 'File exceeds ~540 KB limit for direct Firestore storage. Use External URL mode for large files.'
        );
        return;
      }

      const category: SiteFileCategory = isImage
        ? 'image'
        : picked.type.includes('pdf') || picked.type.includes('text') || picked.type.includes('document')
        ? 'document'
        : picked.type.startsWith('video/') || picked.type.startsWith('audio/')
        ? 'media'
        : 'asset';

      setFileForm((prev) => ({
        ...prev,
        name: prev.name || picked.name,
        mimeType: picked.type || 'application/octet-stream',
        category,
        dataUrl,
        sizeBytes: picked.size,
      }));
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Impossible de lire le fichier.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleSaveFile = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyAction('save-file');
    try {
      await addFileItem({
        name: fileForm.name,
        mimeType: fileForm.mimeType,
        category: fileForm.category,
        storageMode: fileMode === 'upload' ? 'inline' : 'external',
        dataUrl: fileMode === 'upload' ? fileForm.dataUrl : '',
        externalUrl: fileMode === 'external' ? fileForm.externalUrl : '',
        sizeBytes: fileForm.sizeBytes,
        description: fileForm.description,
      });
      setShowFileModal(false);
      setFileForm({
        name: '',
        mimeType: 'image/jpeg',
        category: 'image',
        externalUrl: '',
        dataUrl: '',
        sizeBytes: 0,
        description: '',
      });
      notify('success', isFr ? 'Fichier enregistré dans Firebase.' : 'File saved to Firebase.');
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Erreur lors de l’envoi du fichier.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleCopyFileSource = async (file: SiteFileItem) => {
    const value = file.storageMode === 'external' ? file.externalUrl : file.dataUrl;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(file.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      notify('error', isFr ? 'Copie impossible dans ce navigateur.' : 'Clipboard copy unavailable.');
    }
  };

  const openNewLinkModal = (prefill?: Partial<typeof linkForm>) => {
    setEditingLinkId(null);
    setLinkForm({
      labelEn: prefill?.labelEn || '',
      labelFr: prefill?.labelFr || '',
      url: prefill?.url || '',
      placement: prefill?.placement || 'footer_resources',
      openInNewTab: prefill?.openInNewTab ?? true,
      active: true,
      order: links.length,
      description: prefill?.description || '',
    });
    setShowLinkModal(true);
  };

  const openEditLinkModal = (link: SiteLinkItem) => {
    setEditingLinkId(link.id);
    setLinkForm({
      labelEn: link.labelEn,
      labelFr: link.labelFr,
      url: link.url,
      placement: link.placement,
      openInNewTab: link.openInNewTab,
      active: link.active,
      order: link.order,
      description: link.description,
    });
    setShowLinkModal(true);
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyAction('save-link');
    try {
      if (editingLinkId) {
        await updateLinkItem(editingLinkId, linkForm);
      } else {
        await addLinkItem(linkForm);
      }
      setShowLinkModal(false);
      notify('success', isFr ? 'Lien sauvegardé.' : 'Link saved.');
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Erreur sur le lien.');
    } finally {
      setBusyAction(null);
    }
  };

  const openAttractionModal = (tour?: SiteAttractionItem) => {
    if (tour) {
      setEditingAttractionId(tour.id);
      setAttractionForm({
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
        highlightsText: tour.highlights.join('\n'),
        highlightsFrText: tour.highlightsFr.join('\n'),
        active: tour.active,
        order: tour.order,
      });
    } else {
      setEditingAttractionId(null);
      setAttractionForm({
        title: '',
        titleFr: '',
        price: 790,
        description: '',
        descriptionFr: '',
        tag: 'popular',
        tagFr: 'populaire',
        duration: '4 days',
        durationFr: '4 jours',
        category: 'Adventure',
        location: 'Nepal',
        imageUrl: '',
        bookingUrl: '',
        highlightsText: '',
        highlightsFrText: '',
        active: true,
        order: storedAttractions.length,
      });
    }
    setShowAttractionModal(true);
  };

  const handleSaveAttraction = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyAction('save-attraction');
    try {
      const highlights = attractionForm.highlightsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 8);
      const highlightsFr = attractionForm.highlightsFrText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 8);

      await saveAttractionItem(editingAttractionId, {
        title: attractionForm.title,
        titleFr: attractionForm.titleFr || attractionForm.title,
        price: Number(attractionForm.price),
        description: attractionForm.description,
        descriptionFr: attractionForm.descriptionFr || attractionForm.description,
        tag: attractionForm.tag,
        tagFr: attractionForm.tagFr || attractionForm.tag,
        duration: attractionForm.duration,
        durationFr: attractionForm.durationFr || attractionForm.duration,
        category: attractionForm.category,
        location: attractionForm.location,
        imageUrl: attractionForm.imageUrl,
        bookingUrl: attractionForm.bookingUrl,
        highlights,
        highlightsFr: highlightsFr.length > 0 ? highlightsFr : highlights,
        active: attractionForm.active,
        order: Number(attractionForm.order),
      });
      setShowAttractionModal(false);
      notify('success', isFr ? 'Attraction enregistrée dans Firebase.' : 'Attraction saved to Firebase.');
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Erreur sur attraction.');
    } finally {
      setBusyAction(null);
    }
  };

  const openDestModal = (dest?: SiteDestinationItem) => {
    if (dest) {
      setEditingDestId(dest.id);
      setDestForm({
        name: dest.name,
        title: dest.title,
        titleFr: dest.titleFr,
        location: dest.location,
        country: dest.country,
        categories: dest.categories,
        mainImage: dest.mainImage,
        thumbnailsText: dest.thumbnails.join('\n'),
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
    } else {
      setEditingDestId(null);
      setDestForm({
        name: '',
        title: '',
        titleFr: '',
        location: '',
        country: '',
        categories: ['Cities'],
        mainImage: '',
        thumbnailsText: '',
        distance: '1,200Km',
        temp: '24° C',
        rating: '4.9',
        price: '$1,190',
        tag: 'Trending',
        tagFr: 'Tendance',
        description: '',
        descriptionFr: '',
        bookingUrl: '',
        active: true,
        order: storedDestinations.length,
      });
    }
    setShowDestModal(true);
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyAction('save-dest');
    try {
      const thumbnails = destForm.thumbnailsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 6);

      await saveDestinationItem(editingDestId, {
        name: destForm.name,
        title: destForm.title || destForm.name,
        titleFr: destForm.titleFr || destForm.title || destForm.name,
        location: destForm.location || destForm.name,
        country: destForm.country || destForm.location,
        categories: destForm.categories.length > 0 ? destForm.categories : ['Cities'],
        mainImage: destForm.mainImage,
        thumbnails: thumbnails.length > 0 ? thumbnails : [destForm.mainImage],
        distance: destForm.distance,
        temp: destForm.temp,
        rating: destForm.rating,
        price: destForm.price,
        tag: destForm.tag,
        tagFr: destForm.tagFr || destForm.tag,
        description: destForm.description,
        descriptionFr: destForm.descriptionFr || destForm.description,
        bookingUrl: destForm.bookingUrl,
        active: destForm.active,
        order: Number(destForm.order),
      });
      setShowDestModal(false);
      notify(
        'success',
        isFr ? 'Destination enregistrée dans Firebase.' : 'Destination saved to Firebase.'
      );
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Erreur sur destination.');
    } finally {
      setBusyAction(null);
    }
  };

  const openReviewModal = (review?: SiteReviewItem) => {
    if (review) {
      setEditingReviewId(review.id);
      setReviewForm({
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
    } else {
      setEditingReviewId(null);
      setReviewForm({
        name: '',
        role: '',
        roleFr: '',
        headline: '',
        headlineFr: '',
        text: '',
        textFr: '',
        rating: 5,
        category: 'flights',
        cardStyle: 'quote-top',
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        active: true,
        order: storedReviews.length,
      });
    }
    setShowReviewModal(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyAction('save-review');
    try {
      await saveReviewItem(editingReviewId, {
        name: reviewForm.name,
        role: reviewForm.role,
        roleFr: reviewForm.roleFr || reviewForm.role,
        headline: reviewForm.headline,
        headlineFr: reviewForm.headlineFr || reviewForm.headline,
        text: reviewForm.text,
        textFr: reviewForm.textFr || reviewForm.text,
        rating: Number(reviewForm.rating),
        category: reviewForm.category,
        cardStyle: reviewForm.cardStyle,
        avatar: reviewForm.avatar,
        active: reviewForm.active,
        order: Number(reviewForm.order),
      });
      setShowReviewModal(false);
      notify('success', isFr ? 'Avis enregistré dans Firebase.' : 'Review saved to Firebase.');
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Erreur sur avis.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError(null);
    setUnlockBusy(true);
    try {
      const res = await fetch('/api/admin/auth/unlock', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: unlockPasswordInput }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        setUnlockError(
          isFr
            ? 'Le serveur d’authentification (/api/admin/auth/unlock) n’a pas renvoyé de JSON.'
            : 'Auth endpoint (/api/admin/auth/unlock) returned a non-JSON response.'
        );
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setUnlockError(data.error || (isFr ? 'Mot de passe incorrect.' : 'Incorrect password.'));
        return;
      }
      setAdminToken(data.token || null);
      setLockStatus((prev) => ({ ...prev, authenticated: true }));
      setUnlockPasswordInput('');
    } catch {
      setUnlockError(
        isFr ? 'Impossible de joindre le serveur de vérification.' : 'Unable to reach auth server.'
      );
    } finally {
      setUnlockBusy(false);
    }
  };

  const handleConfigurePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.newPassword.length < 6) {
      notify(
        'error',
        isFr
          ? 'Le mot de passe doit contenir au moins 6 caractères.'
          : 'Password must be at least 6 characters.'
      );
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      notify(
        'error',
        isFr ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.'
      );
      return;
    }

    setBusyAction('configure-password');
    try {
      const res = await fetch('/api/admin/auth/configure', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword,
        }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        notify(
          'error',
          isFr
            ? 'Endpoint /api/admin/auth/configure indisponible (réponse non-JSON).'
            : 'Endpoint /api/admin/auth/configure returned a non-JSON response.'
        );
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        notify('error', data.error || 'Erreur configuration mot de passe.');
        return;
      }
      setAdminToken(data.token || null);
      setLockStatus({
        locked: Boolean(data.locked),
        hasPassword: Boolean(data.hasPassword),
        managedByEnv: Boolean(data.managedByEnv),
        authenticated: true,
      });
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      notify(
        'success',
        isFr
          ? 'Mot de passe Admin enregistré et verrouillage activé.'
          : 'Admin password saved and lock enabled.'
      );
    } catch {
      notify('error', isFr ? 'Erreur réseau avec le serveur.' : 'Server network error.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleDisablePassword = async () => {
    setBusyAction('disable-password');
    try {
      const res = await fetch('/api/admin/auth/disable', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: JSON.stringify({ currentPassword: securityForm.currentPassword }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        notify(
          'error',
          isFr
            ? 'Endpoint /api/admin/auth/disable indisponible (réponse non-JSON).'
            : 'Endpoint /api/admin/auth/disable returned a non-JSON response.'
        );
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        notify('error', data.error || 'Erreur lors de la désactivation.');
        return;
      }
      setAdminToken(null);
      setLockStatus({
        locked: false,
        hasPassword: false,
        managedByEnv: Boolean(data.managedByEnv),
        authenticated: true,
      });
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      notify(
        'success',
        isFr ? 'Verrouillage par mot de passe désactivé.' : 'Password lock disabled.'
      );
    } catch {
      notify('error', isFr ? 'Erreur réseau avec le serveur.' : 'Server network error.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleLockNow = () => {
    setAdminToken(null);
    setLockStatus((prev) => ({ ...prev, authenticated: false }));
    setUnlockPasswordInput('');
    setUnlockError(null);
  };

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      id: 'overview',
      label: isFr ? 'Vue d’ensemble' : 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'content',
      label: isFr ? 'Textes du site' : 'Site Content',
      icon: <FileText className="w-4 h-4" />,
      count: contentItems.length,
    },
    {
      id: 'destinations',
      label: 'Best Destinations',
      icon: <Globe className="w-4 h-4" />,
      count: destinations.length,
    },
    {
      id: 'reviews',
      label: isFr ? 'Avis (Reviews)' : 'Reviews',
      icon: <Star className="w-4 h-4" />,
      count: reviews.length,
    },
    {
      id: 'attractions',
      label: isFr ? 'Hôtels & Attractions' : 'Attractions',
      icon: <Compass className="w-4 h-4" />,
      count: attractions.length,
    },
    {
      id: 'files',
      label: isFr ? 'Fichiers & Médias' : 'Files & Assets',
      icon: <FolderOpen className="w-4 h-4" />,
      count: files.length,
    },
    {
      id: 'links',
      label: isFr ? 'Liens & Menus' : 'Links Manager',
      icon: <Link2 className="w-4 h-4" />,
      count: links.length,
    },
    {
      id: 'security',
      label: isFr ? 'Sécurité / Mot de passe' : 'Security & Lock',
      icon: lockStatus.locked ? (
        <Lock className="w-4 h-4 text-emerald-400" />
      ) : (
        <Unlock className="w-4 h-4 text-amber-400" />
      ),
    },
  ];

  const activeNavLabel = navItems.find((n) => n.id === activeTab)?.label || 'Overview';

  if (lockChecking) {
    return (
      <div className="min-h-screen w-full bg-[#090D16] text-slate-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin" />
          <p className="text-xs text-slate-400">
            {isFr ? 'Vérification de l’accès administrateur...' : 'Checking admin security...'}
          </p>
        </div>
      </div>
    );
  }

  if (lockStatus.locked && !lockStatus.authenticated) {
    return (
      <div
        id="admin-password-gate"
        className="min-h-screen w-full bg-[#090D16] text-slate-100 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Safarihoo Admin</h1>
              <p className="text-xs text-slate-400">
                {isFr
                  ? 'Espace protégé par mot de passe'
                  : 'Password-protected management console'}
              </p>
            </div>
          </div>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isFr ? 'Mot de passe administrateur' : 'Admin Password'}
              </label>
              <div className="relative">
                <input
                  type={showUnlockPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={unlockPasswordInput}
                  onChange={(e) => setUnlockPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowUnlockPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showUnlockPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {unlockError && (
              <div className="px-3 py-2.5 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{unlockError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={unlockBusy}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>
                {unlockBusy
                  ? isFr
                    ? 'Vérification...'
                    : 'Verifying...'
                  : isFr
                  ? 'Déverrouiller l’Admin'
                  : 'Unlock Admin Panel'}
              </span>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={onExitAdmin}
              className="text-slate-400 hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isFr ? 'Retour au site' : 'Back to Public Site'}</span>
            </button>
            <span className="text-slate-500">
              {lockStatus.managedByEnv ? 'ENV' : 'Server Lock'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="safarihoo-admin-panel" className="min-h-screen w-full bg-[#090D16] text-slate-100 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar (260px fixed width on desktop) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] shrink-0 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                S
              </div>
              <div>
                <div className="text-sm font-bold tracking-tight text-white leading-none">
                  Safarihoo CMS
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {isFr ? 'Administration' : 'Admin Console'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  {item.count !== undefined && (
                    <span className="text-xs font-mono tabular-nums text-slate-400">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-3">
          {/* Language Switcher for Admin */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{isFr ? 'Langue site' : 'Site Language'}</span>
            <div className="flex border border-slate-700 rounded overflow-hidden">
              <button
                type="button"
                onClick={() => setLanguage('EN')}
                className={`px-2 py-1 text-xs font-semibold cursor-pointer ${
                  language === 'EN' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('FR')}
                className={`px-2 py-1 text-xs font-semibold cursor-pointer ${
                  language === 'FR' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                FR
              </button>
            </div>
          </div>

          {lockStatus.locked && (
            <button
              type="button"
              onClick={handleLockNow}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-amber-700/60 bg-amber-950/40 hover:bg-amber-900/50 text-xs font-semibold text-amber-200 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isFr ? 'Verrouiller maintenant' : 'Lock Admin Panel'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExitAdmin}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isFr ? 'Retour au site public' : 'Back to Public Site'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar Contract: Breadcrumbs Left, max 2 Primary Actions Right */}
        <header className="h-16 px-4 sm:px-8 border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-sm truncate">
              <span className="text-slate-400">Safarihoo</span>
              <span className="text-slate-600">/</span>
              <span className="font-semibold text-white truncate">{activeNavLabel}</span>
            </div>

            <span
              className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium ml-3 ${
                isConnected ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              {isConnected ? 'Firestore Live' : 'Reconnecting'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {activeTab === 'files' && (
              <button
                type="button"
                onClick={() => setShowFileModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isFr ? 'Ajouter un fichier' : 'Add File'}</span>
              </button>
            )}
            {activeTab === 'links' && (
              <button
                type="button"
                onClick={() => openNewLinkModal()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isFr ? 'Ajouter un lien' : 'Add Link'}</span>
              </button>
            )}
            {activeTab === 'attractions' && (
              <button
                type="button"
                onClick={() => openAttractionModal()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isFr ? 'Nouvelle attraction' : 'New Attraction'}</span>
              </button>
            )}
            {activeTab === 'destinations' && (
              <button
                type="button"
                onClick={() => openDestModal()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isFr ? 'Nouvelle destination' : 'New Destination'}</span>
              </button>
            )}
            {activeTab === 'reviews' && (
              <button
                type="button"
                onClick={() => openReviewModal()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isFr ? 'Nouvel avis' : 'New Review'}</span>
              </button>
            )}
            {activeTab === 'content' && (
              <button
                type="button"
                onClick={() => {
                  setContentDraft({
                    key: '',
                    label: '',
                    group: 'custom',
                    en: '',
                    fr: '',
                  });
                  setShowNewContentModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isFr ? 'Nouveau champ texte' : 'New Text Key'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{isFr ? 'Voir le site' : 'View Site'}</span>
            </button>
          </div>
        </header>

        {/* Feedback / Error Banner */}
        {(statusMessage || lastError) && (
          <div className="px-4 sm:px-8 pt-4">
            {statusMessage && (
              <div
                className={`px-4 py-3 rounded-lg border text-xs sm:text-sm flex items-center justify-between ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-950/50 border-emerald-800 text-emerald-200'
                    : 'bg-red-950/50 border-red-800 text-red-200'
                }`}
              >
                <span>{statusMessage.text}</span>
                <button
                  type="button"
                  onClick={() => setStatusMessage(null)}
                  className="text-current opacity-70 hover:opacity-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {lastError && (
              <div className="mt-2 px-4 py-3 rounded-lg border bg-red-950/50 border-red-800 text-red-200 text-xs flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Firestore: {lastError}</span>
                </span>
                <button
                  type="button"
                  onClick={clearError}
                  className="text-red-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main Viewport */}
        <main className="p-4 sm:p-8 flex-1 max-w-[1280px] w-full">
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="h-24 rounded-lg bg-[#111827] border border-slate-800 animate-pulse"
                  />
                ))}
              </div>
              <div className="h-64 rounded-lg bg-[#111827] border border-slate-800 animate-pulse" />
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#111827] border border-slate-800 rounded-lg p-5">
                      <div className="text-xs text-slate-400 font-medium">
                        {isFr ? 'Textes personnalisés' : 'Text Overrides'}
                      </div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
                        {contentItems.length}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {isFr ? 'sur' : 'of'} {mergedContentRows.length}{' '}
                        {isFr ? 'champs disponibles' : 'editable fields'}
                      </div>
                    </div>

                    <div className="bg-[#111827] border border-slate-800 rounded-lg p-5">
                      <div className="text-xs text-slate-400 font-medium">
                        {isFr ? 'Fichiers stockés' : 'Stored Files'}
                      </div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
                        {files.length}
                      </div>
                      <div className="text-xs text-slate-500 font-mono tabular-nums mt-1">
                        {formatBytes(totalStorageBytes)} {isFr ? 'indexés' : 'indexed'}
                      </div>
                    </div>

                    <div className="bg-[#111827] border border-slate-800 rounded-lg p-5">
                      <div className="text-xs text-slate-400 font-medium">
                        {isFr ? 'Liens configurés' : 'Configured Links'}
                      </div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
                        {links.filter((l) => l.active).length}
                      </div>
                      <div className="text-xs text-slate-500 font-mono tabular-nums mt-1">
                        {links.length} {isFr ? 'au total' : 'total'}
                      </div>
                    </div>

                    <div className="bg-[#111827] border border-slate-800 rounded-lg p-5">
                      <div className="text-xs text-slate-400 font-medium">
                        {isFr ? 'Circuits & Attractions' : 'Active Attractions'}
                      </div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
                        {attractions.length}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {isUsingCustomAttractions
                          ? isFr
                            ? 'Synchronisé Firebase'
                            : 'Synced from Firebase'
                          : isFr
                          ? 'Catalogue par défaut'
                          : 'Default catalog active'}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Row */}
                  <div className="bg-[#111827] border border-slate-800 rounded-lg p-6">
                    <h2 className="text-sm font-semibold text-white mb-4">
                      {isFr ? 'Actions rapides' : 'Quick Actions'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('files');
                          setShowFileModal(true);
                        }}
                        className="flex items-center gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-900/70 hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-blue-400 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {isFr ? 'Téléverser un fichier' : 'Upload a File'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {isFr ? 'Images, PDF ou URL' : 'Images, PDFs, or URL'}
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('links');
                          openNewLinkModal();
                        }}
                        className="flex items-center gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-900/70 hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <Link2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {isFr ? 'Ajouter un lien' : 'Add Site Link'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {isFr ? 'Header, Footer, Barre' : 'Header, Footer, Bar'}
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('content')}
                        className="flex items-center gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-900/70 hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {isFr ? 'Modifier les textes' : 'Edit Site Copy'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {isFr ? 'Titres EN / FR en direct' : 'Live EN / FR headlines'}
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('destinations')}
                        className="flex items-center gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-900/70 hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-white">Best Destinations</div>
                          <div className="text-[11px] text-slate-400">
                            {destinations.length} {isFr ? 'destinations actives' : 'active places'}
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('reviews')}
                        className="flex items-center gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-900/70 hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <Star className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {isFr ? 'Gérer les avis' : 'Manage Reviews'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {reviews.length} {isFr ? 'témoignages' : 'testimonials'}
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('security')}
                        className="flex items-center gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-900/70 hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        {lockStatus.locked ? (
                          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Unlock className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {isFr ? 'Mot de passe Admin' : 'Admin Lock'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {lockStatus.locked
                              ? isFr
                                ? 'Verrouillage actif'
                                : 'Password active'
                              : isFr
                              ? 'Configurer un verrouillage'
                              : 'Set a password'}
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('attractions')}
                        className="flex items-center gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-900/70 hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <Compass className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {isFr ? 'Gérer les attractions' : 'Manage Attractions'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {isFr ? 'Circuits, prix, images' : 'Tours, pricing, photos'}
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Recent Files & Links Split Table */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">
                          {isFr ? 'Derniers fichiers' : 'Recent Files'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setActiveTab('files')}
                          className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
                        >
                          {isFr ? 'Tout voir' : 'View all'}
                        </button>
                      </div>
                      {files.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400">
                          {isFr
                            ? 'Aucun fichier enregistré pour le moment.'
                            : 'No files uploaded yet.'}
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-800">
                          {files.slice(0, 5).map((f) => (
                            <div key={f.id} className="px-5 py-3 flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-xs font-medium text-white truncate">{f.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                                  {f.category} · {formatBytes(f.sizeBytes)}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyFileSource(f)}
                                className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded border border-slate-700 cursor-pointer shrink-0"
                              >
                                {copiedId === f.id ? (isFr ? 'Copié' : 'Copied') : isFr ? 'Copier' : 'Copy'}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">
                          {isFr ? 'Liens publiés' : 'Published Links'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setActiveTab('links')}
                          className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
                        >
                          {isFr ? 'Gérer' : 'Manage'}
                        </button>
                      </div>
                      {links.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400">
                          {isFr
                            ? 'Aucun lien personnalisé ajouté.'
                            : 'No custom links created yet.'}
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-800">
                          {links.slice(0, 5).map((l) => (
                            <div key={l.id} className="px-5 py-3 flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-xs font-medium text-white truncate">
                                  {isFr ? l.labelFr : l.labelEn}
                                </div>
                                <div className="text-[11px] text-slate-400 truncate">
                                  {PLACEMENT_LABELS[l.placement][isFr ? 'fr' : 'en']} · {l.url}
                                </div>
                              </div>
                              <span
                                className={`text-[11px] font-medium shrink-0 ${
                                  l.active ? 'text-emerald-400' : 'text-slate-500'
                                }`}
                              >
                                {l.active ? (isFr ? 'Actif' : 'Active') : isFr ? 'Masqué' : 'Hidden'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SITE CONTENT (EN / FR) */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  {/* Search & Group Filter */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={contentSearch}
                        onChange={(e) => setContentSearch(e.target.value)}
                        placeholder={
                          isFr
                            ? 'Rechercher un titre, texte ou clé (ex: hero.title)...'
                            : 'Search copy, key, or section...'
                        }
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111827] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={contentGroupFilter}
                      onChange={(e) => setContentGroupFilter(e.target.value as 'all' | CmsContentGroup)}
                      className="px-3.5 py-2 rounded-lg bg-[#111827] border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">{isFr ? 'Toutes les sections' : 'All Sections'}</option>
                      {(Object.keys(GROUP_LABELS) as CmsContentGroup[]).map((g) => (
                        <option key={g} value={g}>
                          {GROUP_LABELS[g][isFr ? 'fr' : 'en']}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Content Table */}
                  <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-800">
                    {filteredContentRows.length === 0 ? (
                      <div className="p-10 text-center text-sm text-slate-400">
                        {isFr ? 'Aucun champ trouvé.' : 'No matching text fields.'}
                      </div>
                    ) : (
                      filteredContentRows.map((row) => {
                        const isEditing = editingContentKey === row.key;
                        return (
                          <div key={row.key} className="p-4 sm:p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2.5">
                                  <span className="text-sm font-semibold text-white">{row.label}</span>
                                  <span className="text-[11px] font-mono text-slate-400">
                                    {row.key}
                                  </span>
                                  {row.isOverridden && (
                                    <span className="px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 text-[10px] font-semibold">
                                      {isFr ? 'Modifié (DB)' : 'Customized'}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-400 mt-1">
                                  {GROUP_LABELS[row.group][isFr ? 'fr' : 'en']}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {row.docId && (
                                  <button
                                    type="button"
                                    disabled={busyAction === `reset-${row.docId}`}
                                    onClick={() => handleResetContent(row.docId!)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 cursor-pointer"
                                    title={isFr ? 'Restaurer par défaut' : 'Restore default'}
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>{isFr ? 'Défaut' : 'Reset'}</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isEditing) {
                                      setEditingContentKey(null);
                                      setContentDraft(null);
                                    } else {
                                      setEditingContentKey(row.key);
                                      setContentDraft({
                                        key: row.key,
                                        label: row.label,
                                        group: row.group,
                                        en: row.en,
                                        fr: row.fr,
                                      });
                                    }
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-white cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>{isEditing ? (isFr ? 'Fermer' : 'Cancel') : isFr ? 'Modifier' : 'Edit'}</span>
                                </button>
                              </div>
                            </div>

                            {!isEditing ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs">
                                <div className="bg-slate-900/70 border border-slate-800 rounded p-2.5">
                                  <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">
                                    EN
                                  </div>
                                  <div className="text-slate-200 break-words">{row.en}</div>
                                </div>
                                <div className="bg-slate-900/70 border border-slate-800 rounded p-2.5">
                                  <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">
                                    FR
                                  </div>
                                  <div className="text-slate-200 break-words">{row.fr}</div>
                                </div>
                              </div>
                            ) : (
                              contentDraft && (
                                <form onSubmit={handleSaveContent} className="mt-4 space-y-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs font-medium text-slate-300 mb-1">
                                        English (EN)
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={contentDraft.en}
                                        onChange={(e) =>
                                          setContentDraft({ ...contentDraft, en: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-slate-300 mb-1">
                                        Français (FR)
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={contentDraft.fr}
                                        onChange={(e) =>
                                          setContentDraft({ ...contentDraft, fr: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="submit"
                                      disabled={busyAction === 'save-content'}
                                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                                    >
                                      <Save className="w-3.5 h-3.5" />
                                      <span>
                                        {busyAction === 'save-content'
                                          ? isFr
                                            ? 'Enregistrement...'
                                            : 'Saving...'
                                          : isFr
                                          ? 'Enregistrer'
                                          : 'Save Changes'}
                                      </span>
                                    </button>
                                  </div>
                                </form>
                              )
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: FILES & ASSETS */}
              {activeTab === 'files' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fileSearch}
                        onChange={(e) => setFileSearch(e.target.value)}
                        placeholder={
                          isFr ? 'Rechercher un fichier par nom ou type...' : 'Search files...'
                        }
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111827] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={fileCategoryFilter}
                      onChange={(e) =>
                        setFileCategoryFilter(e.target.value as 'all' | SiteFileCategory)
                      }
                      className="px-3.5 py-2 rounded-lg bg-[#111827] border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">{isFr ? 'Toutes catégories' : 'All Categories'}</option>
                      <option value="image">{isFr ? 'Images' : 'Images'}</option>
                      <option value="document">{isFr ? 'Documents (PDF)' : 'Documents (PDF)'}</option>
                      <option value="media">{isFr ? 'Médias' : 'Media'}</option>
                      <option value="asset">{isFr ? 'Autres ressources' : 'Other Assets'}</option>
                    </select>
                  </div>

                  {filteredFiles.length === 0 ? (
                    <div className="bg-[#111827] border border-slate-800 rounded-lg p-12 text-center">
                      <FolderOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                      <h3 className="text-sm font-semibold text-white">
                        {isFr ? 'Aucun fichier dans la base Firebase' : 'No files stored yet'}
                      </h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-5">
                        {isFr
                          ? 'Téléversez des images (compressées automatiquement), des PDF ou enregistrez des URL externes pour les réutiliser partout sur Safarihoo.'
                          : 'Upload images (auto-compressed for Firestore), PDFs, or register external file URLs to reuse across Safarihoo.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowFileModal(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isFr ? 'Ajouter votre premier fichier' : 'Add Your First File'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                            <th className="py-3 px-4">{isFr ? 'Fichier' : 'File'}</th>
                            <th className="py-3 px-4">{isFr ? 'Catégorie' : 'Category'}</th>
                            <th className="py-3 px-4">{isFr ? 'Source' : 'Storage'}</th>
                            <th className="py-3 px-4 text-right">{isFr ? 'Taille' : 'Size'}</th>
                            <th className="py-3 px-4 text-right">{isFr ? 'Actions' : 'Actions'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                          {filteredFiles.map((file) => {
                            const href =
                              file.storageMode === 'external' ? file.externalUrl : file.dataUrl;
                            const isImg =
                              file.category === 'image' || file.mimeType.startsWith('image/');
                            return (
                              <tr key={file.id} className="hover:bg-slate-800/40">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                                      {isImg && href ? (
                                        <img
                                          src={href}
                                          alt={file.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <FileIcon className="w-4 h-4 text-slate-400" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-medium text-white truncate max-w-[240px]">
                                        {file.name}
                                      </div>
                                      <div className="text-xs text-slate-400 truncate max-w-[240px]">
                                        {file.description || file.mimeType}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-xs text-slate-300 capitalize">
                                  {file.category}
                                </td>
                                <td className="py-3 px-4 text-xs font-mono text-slate-400">
                                  {file.storageMode === 'inline' ? 'Firestore' : 'External URL'}
                                </td>
                                <td className="py-3 px-4 text-xs font-mono tabular-nums text-slate-300 text-right">
                                  {formatBytes(file.sizeBytes)}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleCopyFileSource(file)}
                                      className="p-1.5 rounded border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                                      title={isFr ? 'Copier le lien / source' : 'Copy source'}
                                    >
                                      {copiedId === file.id ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                    {file.storageMode === 'external' && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveTab('links');
                                          openNewLinkModal({
                                            labelEn: file.name,
                                            labelFr: file.name,
                                            url: file.externalUrl,
                                            placement: 'footer_resources',
                                          });
                                        }}
                                        className="p-1.5 rounded border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                                        title={isFr ? 'Publier comme lien' : 'Publish as Link'}
                                      >
                                        <Link2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    <a
                                      href={href}
                                      download={file.storageMode === 'inline' ? file.name : undefined}
                                      target={file.storageMode === 'external' ? '_blank' : undefined}
                                      rel={
                                        file.storageMode === 'external'
                                          ? 'noopener noreferrer'
                                          : undefined
                                      }
                                      className="p-1.5 rounded border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white"
                                      title={isFr ? 'Télécharger / Ouvrir' : 'Download / Open'}
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => deleteFileItem(file.id)}
                                      className="p-1.5 rounded border border-red-900/60 hover:bg-red-950 text-red-400 hover:text-red-300 cursor-pointer"
                                      title={isFr ? 'Supprimer' : 'Delete'}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: LINKS MANAGER */}
              {activeTab === 'links' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={linkSearch}
                        onChange={(e) => setLinkSearch(e.target.value)}
                        placeholder={isFr ? 'Rechercher un lien...' : 'Search links...'}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111827] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={linkPlacementFilter}
                      onChange={(e) =>
                        setLinkPlacementFilter(e.target.value as 'all' | SiteLinkPlacement)
                      }
                      className="px-3.5 py-2 rounded-lg bg-[#111827] border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">
                        {isFr ? 'Tous les emplacements' : 'All Placements'}
                      </option>
                      {(Object.keys(PLACEMENT_LABELS) as SiteLinkPlacement[]).map((p) => (
                        <option key={p} value={p}>
                          {PLACEMENT_LABELS[p][isFr ? 'fr' : 'en']}
                        </option>
                      ))}
                    </select>
                  </div>

                  {filteredLinks.length === 0 ? (
                    <div className="bg-[#111827] border border-slate-800 rounded-lg p-12 text-center">
                      <Link2 className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                      <h3 className="text-sm font-semibold text-white">
                        {isFr ? 'Aucun lien personnalisé' : 'No custom links yet'}
                      </h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-5">
                        {isFr
                          ? 'Ajoutez des liens dans le menu principal, les colonnes du pied de page ou un bandeau public dédié.'
                          : 'Add navigation, footer, or public quick-bar links synced immediately to Safarihoo.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => openNewLinkModal()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isFr ? 'Créer un lien' : 'Create Link'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                            <th className="py-3 px-4">{isFr ? 'Ordre' : 'Order'}</th>
                            <th className="py-3 px-4">{isFr ? 'Libellé (EN / FR)' : 'Label (EN / FR)'}</th>
                            <th className="py-3 px-4">{isFr ? 'Emplacement' : 'Placement'}</th>
                            <th className="py-3 px-4">URL</th>
                            <th className="py-3 px-4">{isFr ? 'Statut' : 'Status'}</th>
                            <th className="py-3 px-4 text-right">{isFr ? 'Actions' : 'Actions'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                          {filteredLinks.map((link) => (
                            <tr key={link.id} className="hover:bg-slate-800/40">
                              <td className="py-3 px-4 text-xs font-mono tabular-nums text-slate-400">
                                {link.order}
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-xs font-semibold text-white">{link.labelEn}</div>
                                <div className="text-[11px] text-slate-400">{link.labelFr}</div>
                              </td>
                              <td className="py-3 px-4 text-xs text-slate-300">
                                {PLACEMENT_LABELS[link.placement][isFr ? 'fr' : 'en']}
                              </td>
                              <td className="py-3 px-4">
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1 max-w-[220px] truncate"
                                >
                                  <span className="truncate">{link.url}</span>
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateLinkItem(link.id, {
                                      ...link,
                                      active: !link.active,
                                    })
                                  }
                                  className={`text-xs font-semibold cursor-pointer ${
                                    link.active ? 'text-emerald-400' : 'text-slate-500'
                                  }`}
                                >
                                  {link.active
                                    ? isFr
                                      ? 'Actif'
                                      : 'Active'
                                    : isFr
                                    ? 'Désactivé'
                                    : 'Disabled'}
                                </button>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditLinkModal(link)}
                                    className="p-1.5 rounded border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                                    title={isFr ? 'Modifier' : 'Edit'}
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteLinkItem(link.id)}
                                    className="p-1.5 rounded border border-red-900/60 hover:bg-red-950 text-red-400 hover:text-red-300 cursor-pointer"
                                    title={isFr ? 'Supprimer' : 'Delete'}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: HOTELS & ATTRACTIONS */}
              {activeTab === 'attractions' && (
                <div className="space-y-4">
                  {!isUsingCustomAttractions && (
                    <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {isFr
                            ? 'Catalogue par défaut actif (5 circuits Népal)'
                            : 'Default catalog active (5 Nepal tours)'}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {isFr
                            ? 'Importez ces circuits dans Firebase pour les modifier directement, ou créez vos propres attractions.'
                            : 'Import these tours into Firebase to customize them, or add your own new attractions.'}
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={busyAction === 'seed-attractions'}
                        onClick={async () => {
                          setBusyAction('seed-attractions');
                          try {
                            await importDefaultAttractions();
                            notify(
                              'success',
                              isFr
                                ? 'Les 5 circuits par défaut ont été importés dans Firebase.'
                                : 'Default 5 tours imported into Firebase.'
                            );
                          } catch (err) {
                            notify(
                              'error',
                              err instanceof Error ? err.message : 'Erreur import.'
                            );
                          } finally {
                            setBusyAction(null);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>
                          {busyAction === 'seed-attractions'
                            ? isFr
                              ? 'Importation...'
                              : 'Importing...'
                            : isFr
                            ? 'Importer dans Firebase'
                            : 'Import to Firebase'}
                        </span>
                      </button>
                    </div>
                  )}

                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={attractionSearch}
                      onChange={(e) => setAttractionSearch(e.target.value)}
                      placeholder={
                        isFr
                          ? 'Rechercher une attraction ou destination...'
                          : 'Search attractions or locations...'
                      }
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111827] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                          <th className="py-3 px-4">{isFr ? 'Ordre' : 'Order'}</th>
                          <th className="py-3 px-4">{isFr ? 'Attraction' : 'Attraction'}</th>
                          <th className="py-3 px-4">{isFr ? 'Catégorie' : 'Category'}</th>
                          <th className="py-3 px-4">{isFr ? 'Durée' : 'Duration'}</th>
                          <th className="py-3 px-4 text-right">{isFr ? 'Prix' : 'Price'}</th>
                          <th className="py-3 px-4 text-right">{isFr ? 'Actions' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-sm">
                        {filteredAttractions.map((tour) => (
                          <tr key={tour.id} className="hover:bg-slate-800/40">
                            <td className="py-3 px-4 text-xs font-mono tabular-nums text-slate-400">
                              {tour.order}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={tour.imageUrl}
                                  alt={tour.title}
                                  className="w-11 h-11 rounded object-cover border border-slate-700 shrink-0"
                                />
                                <div>
                                  <div className="text-xs font-semibold text-white">
                                    {isFr ? tour.titleFr : tour.title}
                                  </div>
                                  <div className="text-[11px] text-slate-400">{tour.location}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-300">{tour.category}</td>
                            <td className="py-3 px-4 text-xs text-slate-300">
                              {isFr ? tour.durationFr : tour.duration}
                            </td>
                            <td className="py-3 px-4 text-xs font-mono tabular-nums text-white text-right">
                              ${tour.price}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openAttractionModal(tour)}
                                  className="p-1.5 rounded border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                                  title={isFr ? 'Modifier' : 'Edit'}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                {isUsingCustomAttractions && (
                                  <button
                                    type="button"
                                    onClick={() => deleteAttractionItem(tour.id)}
                                    className="p-1.5 rounded border border-red-900/60 hover:bg-red-950 text-red-400 hover:text-red-300 cursor-pointer"
                                    title={isFr ? 'Supprimer' : 'Delete'}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: BEST DESTINATIONS */}
              {activeTab === 'destinations' && (
                <div className="space-y-4">
                  {!isUsingCustomDestinations && (
                    <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {isFr
                            ? 'Catalogue par défaut actif (8 destinations)'
                            : 'Default catalog active (8 destinations)'}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {isFr
                            ? 'Importez ces 8 destinations dans Firebase pour les modifier ou en ajouter de nouvelles.'
                            : 'Import these 8 destinations into Firebase to customize or add your own.'}
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={busyAction === 'seed-destinations'}
                        onClick={async () => {
                          setBusyAction('seed-destinations');
                          try {
                            await importDefaultDestinations();
                            notify(
                              'success',
                              isFr
                                ? 'Les 8 destinations par défaut ont été importées dans Firebase.'
                                : 'Default 8 destinations imported into Firebase.'
                            );
                          } catch (err) {
                            notify(
                              'error',
                              err instanceof Error ? err.message : 'Erreur import.'
                            );
                          } finally {
                            setBusyAction(null);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>
                          {busyAction === 'seed-destinations'
                            ? isFr
                              ? 'Importation...'
                              : 'Importing...'
                            : isFr
                            ? 'Importer dans Firebase'
                            : 'Import to Firebase'}
                        </span>
                      </button>
                    </div>
                  )}

                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={destSearch}
                      onChange={(e) => setDestSearch(e.target.value)}
                      placeholder={
                        isFr
                          ? 'Rechercher une destination (ville, pays, titre)...'
                          : 'Search destination (city, country, title)...'
                      }
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111827] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                          <th className="py-3 px-4">{isFr ? 'Ordre' : 'Order'}</th>
                          <th className="py-3 px-4">{isFr ? 'Destination' : 'Destination'}</th>
                          <th className="py-3 px-4">{isFr ? 'Catégories' : 'Categories'}</th>
                          <th className="py-3 px-4">{isFr ? 'Note' : 'Rating'}</th>
                          <th className="py-3 px-4 text-right">{isFr ? 'Prix' : 'Price'}</th>
                          <th className="py-3 px-4 text-right">{isFr ? 'Actions' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-sm">
                        {filteredDestinations.map((dest) => (
                          <tr key={dest.id} className="hover:bg-slate-800/40">
                            <td className="py-3 px-4 text-xs font-mono tabular-nums text-slate-400">
                              {dest.order}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={dest.mainImage}
                                  alt={dest.name}
                                  className="w-11 h-11 rounded object-cover border border-slate-700 shrink-0"
                                />
                                <div>
                                  <div className="text-xs font-semibold text-white">
                                    {dest.name}{' '}
                                    <span className="text-slate-400 font-normal">
                                      — {isFr ? dest.titleFr : dest.title}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-400">{dest.location}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-300">
                              {dest.categories.join(', ')}
                            </td>
                            <td className="py-3 px-4 text-xs font-mono tabular-nums text-amber-400">
                              {dest.rating}
                            </td>
                            <td className="py-3 px-4 text-xs font-mono tabular-nums text-white text-right">
                              {dest.price}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openDestModal(dest)}
                                  className="p-1.5 rounded border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                                  title={isFr ? 'Modifier' : 'Edit'}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                {isUsingCustomDestinations && (
                                  <button
                                    type="button"
                                    onClick={() => deleteDestinationItem(dest.id)}
                                    className="p-1.5 rounded border border-red-900/60 hover:bg-red-950 text-red-400 hover:text-red-300 cursor-pointer"
                                    title={isFr ? 'Supprimer' : 'Delete'}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {!isUsingCustomReviews && (
                    <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {isFr
                            ? 'Avis par défaut actifs (6 témoignages)'
                            : 'Default reviews active (6 testimonials)'}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {isFr
                            ? 'Importez ces avis dans Firebase pour modifier les auteurs, textes, notes et avatars.'
                            : 'Import these reviews into Firebase to edit authors, testimonials, ratings, and avatars.'}
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={busyAction === 'seed-reviews'}
                        onClick={async () => {
                          setBusyAction('seed-reviews');
                          try {
                            await importDefaultReviews();
                            notify(
                              'success',
                              isFr
                                ? 'Les 6 avis par défaut ont été importés dans Firebase.'
                                : 'Default 6 reviews imported into Firebase.'
                            );
                          } catch (err) {
                            notify(
                              'error',
                              err instanceof Error ? err.message : 'Erreur import.'
                            );
                          } finally {
                            setBusyAction(null);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>
                          {busyAction === 'seed-reviews'
                            ? isFr
                              ? 'Importation...'
                              : 'Importing...'
                            : isFr
                            ? 'Importer dans Firebase'
                            : 'Import to Firebase'}
                        </span>
                      </button>
                    </div>
                  )}

                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={reviewSearch}
                      onChange={(e) => setReviewSearch(e.target.value)}
                      placeholder={
                        isFr
                          ? 'Rechercher un avis (nom, texte, catégorie)...'
                          : 'Search reviews (name, comment, category)...'
                      }
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111827] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="bg-[#111827] border border-slate-800 rounded-lg overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                          <th className="py-3 px-4">{isFr ? 'Ordre' : 'Order'}</th>
                          <th className="py-3 px-4">{isFr ? 'Auteur' : 'Author'}</th>
                          <th className="py-3 px-4">{isFr ? 'Catégorie' : 'Category'}</th>
                          <th className="py-3 px-4">{isFr ? 'Note' : 'Rating'}</th>
                          <th className="py-3 px-4">{isFr ? 'Extrait' : 'Excerpt'}</th>
                          <th className="py-3 px-4 text-right">{isFr ? 'Actions' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-sm">
                        {filteredReviews.map((rev) => (
                          <tr key={rev.id} className="hover:bg-slate-800/40">
                            <td className="py-3 px-4 text-xs font-mono tabular-nums text-slate-400">
                              {rev.order}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={rev.avatar}
                                  alt={rev.name}
                                  className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                                />
                                <div>
                                  <div className="text-xs font-semibold text-white">{rev.name}</div>
                                  <div className="text-[11px] text-slate-400">
                                    {isFr ? rev.roleFr : rev.role}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-xs uppercase tracking-wider text-slate-300">
                              {rev.category}
                            </td>
                            <td className="py-3 px-4 text-xs font-mono tabular-nums text-amber-400">
                              {rev.rating}/5
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-300 max-w-xs truncate">
                              {isFr ? rev.textFr : rev.text}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openReviewModal(rev)}
                                  className="p-1.5 rounded border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                                  title={isFr ? 'Modifier' : 'Edit'}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                {isUsingCustomReviews && (
                                  <button
                                    type="button"
                                    onClick={() => deleteReviewItem(rev.id)}
                                    className="p-1.5 rounded border border-red-900/60 hover:bg-red-950 text-red-400 hover:text-red-300 cursor-pointer"
                                    title={isFr ? 'Supprimer' : 'Delete'}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: SECURITY / PASSWORD LOCK */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
                            lockStatus.locked
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                              : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                          }`}
                        >
                          {lockStatus.locked ? (
                            <ShieldCheck className="w-5 h-5" />
                          ) : (
                            <Unlock className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-white">
                            {isFr
                              ? 'Verrouillage par mot de passe de l’Admin Panel'
                              : 'Admin Panel Password Lock'}
                          </h2>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {lockStatus.locked
                              ? isFr
                                ? 'Actif : un mot de passe est exigé à l’ouverture de l’administration.'
                                : 'Active: password required before accessing the admin console.'
                              : isFr
                              ? 'Désactivé : définissez un mot de passe ci-dessous pour protéger l’accès.'
                              : 'Unlocked: set a password below to lock access to this admin console.'}
                          </p>
                        </div>
                      </div>

                      {lockStatus.locked && (
                        <button
                          type="button"
                          onClick={handleLockNow}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-600/50 text-amber-200 text-xs font-semibold shrink-0 cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{isFr ? 'Verrouiller' : 'Lock Now'}</span>
                        </button>
                      )}
                    </div>

                    {lockServerUnavailable && (
                      <div className="p-3.5 rounded-lg bg-amber-950/50 border border-amber-800 text-amber-200 text-xs">
                        {isFr
                          ? 'Les endpoints d’authentification (/api/admin/auth/*) ne répondent pas encore sur cet hébergement. Déployez la mise à jour (/api/admin/auth/* et vercel.json) ou lancez le serveur Node (npm start / dev).'
                          : 'Backend auth endpoints (/api/admin/auth/*) are not responding on this host yet. Redeploy with /api/admin/auth/* & vercel.json or run the Node server.'}
                      </div>
                    )}

                    {lockServerError && !lockServerUnavailable && (
                      <div className="p-3.5 rounded-lg bg-red-950/50 border border-red-800 text-red-200 text-xs">
                        {lockServerError}
                      </div>
                    )}

                    {lockStatus.managedByEnv ? (
                      <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 space-y-1">
                        <div className="font-semibold text-white">
                          {isFr
                            ? 'Mot de passe géré par variable d’environnement (ADMIN_PASSCODE)'
                            : 'Password managed via ADMIN_PASSCODE environment variable'}
                        </div>
                        <p className="text-slate-400">
                          {isFr
                            ? 'Pour modifier ou retirer ce mot de passe, mettez à jour ADMIN_PASSCODE dans la configuration serveur.'
                            : 'Update ADMIN_PASSCODE in server environment settings to change or disable this passcode.'}
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleConfigurePassword} className="space-y-4 pt-2 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-white">
                            {lockStatus.locked
                              ? isFr
                                ? 'Modifier le mot de passe'
                                : 'Change Admin Password'
                              : isFr
                              ? 'Activer et définir un mot de passe'
                              : 'Enable & Set Admin Password'}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setShowSecurityPasswords((s) => !s)}
                            className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                          >
                            {showSecurityPasswords ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                            <span>{showSecurityPasswords ? (isFr ? 'Masquer' : 'Hide') : isFr ? 'Afficher' : 'Show'}</span>
                          </button>
                        </div>

                        {lockStatus.locked && (
                          <div>
                            <label className="block text-xs text-slate-300 mb-1">
                              {isFr
                                ? 'Mot de passe actuel (optionnel si session déjà ouverte)'
                                : 'Current password (optional while unlocked)'}
                            </label>
                            <input
                              type={showSecurityPasswords ? 'text' : 'password'}
                              value={securityForm.currentPassword}
                              onChange={(e) =>
                                setSecurityForm({ ...securityForm, currentPassword: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-slate-300 mb-1">
                              {isFr ? 'Nouveau mot de passe (min. 6 caractères)' : 'New Password (min 6 chars)'}
                            </label>
                            <input
                              type={showSecurityPasswords ? 'text' : 'password'}
                              required
                              minLength={6}
                              maxLength={128}
                              value={securityForm.newPassword}
                              onChange={(e) =>
                                setSecurityForm({ ...securityForm, newPassword: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-300 mb-1">
                              {isFr ? 'Confirmer le mot de passe' : 'Confirm Password'}
                            </label>
                            <input
                              type={showSecurityPasswords ? 'text' : 'password'}
                              required
                              minLength={6}
                              maxLength={128}
                              value={securityForm.confirmPassword}
                              onChange={(e) =>
                                setSecurityForm({ ...securityForm, confirmPassword: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <button
                            type="submit"
                            disabled={busyAction === 'configure-password' || lockServerUnavailable}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer disabled:opacity-50"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>
                              {lockStatus.locked
                                ? isFr
                                  ? 'Mettre à jour le mot de passe'
                                  : 'Update Password'
                                : isFr
                                ? 'Activer le verrouillage'
                                : 'Enable Password Lock'}
                            </span>
                          </button>

                          {lockStatus.locked && (
                            <button
                              type="button"
                              disabled={busyAction === 'disable-password'}
                              onClick={handleDisablePassword}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-900/70 bg-red-950/30 hover:bg-red-950/60 text-xs font-semibold text-red-300 cursor-pointer"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              <span>
                                {isFr ? 'Désactiver le mot de passe' : 'Disable Password Lock'}
                              </span>
                            </button>
                          )}
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* MODAL: New Custom Text Key */}
      {showNewContentModal && contentDraft && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setShowNewContentModal(false)}
        >
          <div
            className="w-full max-w-lg bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {isFr ? 'Ajouter un champ texte' : 'Add Custom Content Key'}
              </h3>
              <button
                type="button"
                onClick={() => setShowNewContentModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveContent} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Clé unique' : 'Key ID'}
                  </label>
                  <input
                    type="text"
                    required
                    value={contentDraft.key}
                    onChange={(e) => setContentDraft({ ...contentDraft, key: e.target.value })}
                    placeholder="custom.promo.banner"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Groupe' : 'Group'}
                  </label>
                  <select
                    value={contentDraft.group}
                    onChange={(e) =>
                      setContentDraft({
                        ...contentDraft,
                        group: e.target.value as CmsContentGroup,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  >
                    {(Object.keys(GROUP_LABELS) as CmsContentGroup[]).map((g) => (
                      <option key={g} value={g}>
                        {GROUP_LABELS[g][isFr ? 'fr' : 'en']}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  {isFr ? 'Nom du champ' : 'Field Label'}
                </label>
                <input
                  type="text"
                  required
                  value={contentDraft.label}
                  onChange={(e) => setContentDraft({ ...contentDraft, label: e.target.value })}
                  placeholder="Promo Banner Text"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">English (EN)</label>
                <textarea
                  rows={2}
                  value={contentDraft.en}
                  onChange={(e) => setContentDraft({ ...contentDraft, en: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Français (FR)</label>
                <textarea
                  rows={2}
                  value={contentDraft.fr}
                  onChange={(e) => setContentDraft({ ...contentDraft, fr: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewContentModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 cursor-pointer"
                >
                  {isFr ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer"
                >
                  {isFr ? 'Créer' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add File */}
      {showFileModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setShowFileModal(false)}
        >
          <div
            className="w-full max-w-lg bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {isFr ? 'Ajouter un fichier à Firebase' : 'Add File to Firebase'}
              </h3>
              <button
                type="button"
                onClick={() => setShowFileModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setFileMode('upload')}
                className={`py-2 rounded text-xs font-semibold cursor-pointer ${
                  fileMode === 'upload' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                {isFr ? 'Téléverser depuis l’appareil' : 'Upload from Device'}
              </button>
              <button
                type="button"
                onClick={() => setFileMode('external')}
                className={`py-2 rounded text-xs font-semibold cursor-pointer ${
                  fileMode === 'external' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                {isFr ? 'URL fichier externe' : 'External File URL'}
              </button>
            </div>

            <form onSubmit={handleSaveFile} className="space-y-3">
              {fileMode === 'upload' ? (
                <div>
                  <label className="block border border-dashed border-slate-700 hover:border-blue-500 rounded-lg p-5 text-center cursor-pointer bg-slate-950/60">
                    <Upload className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-xs font-medium text-white">
                      {fileForm.dataUrl
                        ? isFr
                          ? `Prêt : ${fileForm.name} (${formatBytes(fileForm.sizeBytes)})`
                          : `Ready: ${fileForm.name} (${formatBytes(fileForm.sizeBytes)})`
                        : isFr
                        ? 'Cliquez pour choisir une image, PDF ou document (< 540 Ko)'
                        : 'Click to pick an image, PDF, or document (< 540 KB)'}
                    </div>
                    <input
                      type="file"
                      onChange={handleFilePick}
                      className="hidden"
                      accept="image/*,.pdf,.txt,.csv,.json,.doc,.docx"
                    />
                  </label>
                </div>
              ) : (
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'URL du fichier (https://...)' : 'File URL (https://...)'}
                  </label>
                  <input
                    type="url"
                    required
                    value={fileForm.externalUrl}
                    onChange={(e) => setFileForm({ ...fileForm, externalUrl: e.target.value })}
                    placeholder="https://cdn.example.com/brochure.pdf"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Nom du fichier' : 'File Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fileForm.name}
                    onChange={(e) => setFileForm({ ...fileForm, name: e.target.value })}
                    placeholder="safarihoo-guide.pdf"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Catégorie' : 'Category'}
                  </label>
                  <select
                    value={fileForm.category}
                    onChange={(e) =>
                      setFileForm({ ...fileForm, category: e.target.value as SiteFileCategory })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  >
                    <option value="image">Image</option>
                    <option value="document">Document</option>
                    <option value="media">Media</option>
                    <option value="asset">Asset</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  {isFr ? 'Description (optionnel)' : 'Description (optional)'}
                </label>
                <input
                  type="text"
                  value={fileForm.description}
                  onChange={(e) => setFileForm({ ...fileForm, description: e.target.value })}
                  placeholder={isFr ? 'Bannière promo été...' : 'Summer promo banner...'}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFileModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 cursor-pointer"
                >
                  {isFr ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={
                    busyAction === 'save-file' ||
                    (fileMode === 'upload' && !fileForm.dataUrl) ||
                    (fileMode === 'external' && !fileForm.externalUrl)
                  }
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer disabled:opacity-50"
                >
                  {busyAction === 'save-file'
                    ? isFr
                      ? 'Enregistrement...'
                      : 'Saving...'
                    : isFr
                    ? 'Enregistrer'
                    : 'Save File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Link */}
      {showLinkModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setShowLinkModal(false)}
        >
          <div
            className="w-full max-w-lg bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingLinkId
                  ? isFr
                    ? 'Modifier le lien'
                    : 'Edit Link'
                  : isFr
                  ? 'Ajouter un lien'
                  : 'Add New Link'}
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Label (EN)</label>
                  <input
                    type="text"
                    required
                    value={linkForm.labelEn}
                    onChange={(e) => setLinkForm({ ...linkForm, labelEn: e.target.value })}
                    placeholder="Travel Insurance"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Libellé (FR)</label>
                  <input
                    type="text"
                    required
                    value={linkForm.labelFr}
                    onChange={(e) => setLinkForm({ ...linkForm, labelFr: e.target.value })}
                    placeholder="Assurance Voyage"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">URL</label>
                <input
                  type="text"
                  required
                  value={linkForm.url}
                  onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                  placeholder="https://safarihoo.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Emplacement sur le site' : 'Placement'}
                  </label>
                  <select
                    value={linkForm.placement}
                    onChange={(e) =>
                      setLinkForm({ ...linkForm, placement: e.target.value as SiteLinkPlacement })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  >
                    {(Object.keys(PLACEMENT_LABELS) as SiteLinkPlacement[]).map((p) => (
                      <option key={p} value={p}>
                        {PLACEMENT_LABELS[p][isFr ? 'fr' : 'en']}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Ordre d’affichage' : 'Display Order'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10000}
                    value={linkForm.order}
                    onChange={(e) => setLinkForm({ ...linkForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkForm.openInNewTab}
                    onChange={(e) => setLinkForm({ ...linkForm, openInNewTab: e.target.checked })}
                    className="rounded border-slate-700"
                  />
                  <span>{isFr ? 'Ouvrir dans un nouvel onglet' : 'Open in new tab'}</span>
                </label>

                <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkForm.active}
                    onChange={(e) => setLinkForm({ ...linkForm, active: e.target.checked })}
                    className="rounded border-slate-700"
                  />
                  <span>{isFr ? 'Visible sur le site' : 'Visible publicly'}</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 cursor-pointer"
                >
                  {isFr ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={busyAction === 'save-link'}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer"
                >
                  {isFr ? 'Enregistrer' : 'Save Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Attraction */}
      {showAttractionModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setShowAttractionModal(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingAttractionId
                  ? isFr
                    ? 'Modifier l’attraction'
                    : 'Edit Attraction'
                  : isFr
                  ? 'Nouvelle attraction / circuit'
                  : 'New Attraction / Tour'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAttractionModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAttraction} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Titre (EN)</label>
                  <input
                    type="text"
                    required
                    value={attractionForm.title}
                    onChange={(e) => setAttractionForm({ ...attractionForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Titre (FR)</label>
                  <input
                    type="text"
                    required
                    value={attractionForm.titleFr}
                    onChange={(e) =>
                      setAttractionForm({ ...attractionForm, titleFr: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Prix ($)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={attractionForm.price}
                    onChange={(e) =>
                      setAttractionForm({ ...attractionForm, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Catégorie' : 'Category'}
                  </label>
                  <select
                    value={attractionForm.category}
                    onChange={(e) =>
                      setAttractionForm({
                        ...attractionForm,
                        category: e.target.value as AttractionCategory,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  >
                    <option value="Adventure">Adventure</option>
                    <option value="Culture">Culture</option>
                    <option value="Wellness">Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Durée (EN)' : 'Duration (EN)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={attractionForm.duration}
                    onChange={(e) =>
                      setAttractionForm({ ...attractionForm, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Durée (FR)' : 'Duration (FR)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={attractionForm.durationFr}
                    onChange={(e) =>
                      setAttractionForm({ ...attractionForm, durationFr: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={attractionForm.location}
                    onChange={(e) =>
                      setAttractionForm({ ...attractionForm, location: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Tag (EN)</label>
                  <input
                    type="text"
                    required
                    value={attractionForm.tag}
                    onChange={(e) => setAttractionForm({ ...attractionForm, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Tag (FR)</label>
                  <input
                    type="text"
                    required
                    value={attractionForm.tagFr}
                    onChange={(e) =>
                      setAttractionForm({ ...attractionForm, tagFr: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-300">
                    {isFr ? 'Image (URL ou fichier enregistré)' : 'Image (URL or stored file)'}
                  </label>
                  {files.some((f) => f.category === 'image') && (
                    <select
                      value=""
                      onChange={(e) => {
                        const chosen = files.find((f) => f.id === e.target.value);
                        if (chosen) {
                          setAttractionForm({
                            ...attractionForm,
                            imageUrl:
                              chosen.storageMode === 'external'
                                ? chosen.externalUrl
                                : chosen.dataUrl,
                          });
                        }
                      }}
                      className="text-xs bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-blue-300"
                    >
                      <option value="">
                        {isFr ? 'Choisir depuis Fichiers...' : 'Pick from Files...'}
                      </option>
                      {files
                        .filter((f) => f.category === 'image')
                        .map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    required
                    value={attractionForm.imageUrl}
                    onChange={(e) =>
                      setAttractionForm({ ...attractionForm, imageUrl: e.target.value })
                    }
                    placeholder="https://... or /assets/..."
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                  {attractionForm.imageUrl && (
                    <img
                      src={attractionForm.imageUrl}
                      alt="Preview"
                      className="w-10 h-10 rounded object-cover border border-slate-700 shrink-0"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  {isFr ? 'Lien de réservation (optionnel)' : 'Booking URL (optional)'}
                </label>
                <input
                  type="url"
                  value={attractionForm.bookingUrl}
                  onChange={(e) =>
                    setAttractionForm({ ...attractionForm, bookingUrl: e.target.value })
                  }
                  placeholder="https://www.trip.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Description (EN)</label>
                  <textarea
                    rows={2}
                    required
                    value={attractionForm.description}
                    onChange={(e) =>
                      setAttractionForm({ ...attractionForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Description (FR)</label>
                  <textarea
                    rows={2}
                    required
                    value={attractionForm.descriptionFr}
                    onChange={(e) =>
                      setAttractionForm({ ...attractionForm, descriptionFr: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Points forts EN (1 par ligne)' : 'Highlights EN (1 per line)'}
                  </label>
                  <textarea
                    rows={3}
                    value={attractionForm.highlightsText}
                    onChange={(e) =>
                      setAttractionForm({ ...attractionForm, highlightsText: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Points forts FR (1 par ligne)' : 'Highlights FR (1 per line)'}
                  </label>
                  <textarea
                    rows={3}
                    value={attractionForm.highlightsFrText}
                    onChange={(e) =>
                      setAttractionForm({ ...attractionForm, highlightsFrText: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attractionForm.active}
                    onChange={(e) =>
                      setAttractionForm({ ...attractionForm, active: e.target.checked })
                    }
                  />
                  <span>{isFr ? 'Afficher publiquement' : 'Show publicly'}</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAttractionModal(false)}
                    className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 cursor-pointer"
                  >
                    {isFr ? 'Annuler' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={busyAction === 'save-attraction'}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer"
                  >
                    {isFr ? 'Enregistrer' : 'Save Attraction'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Best Destination */}
      {showDestModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setShowDestModal(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingDestId
                  ? isFr
                    ? 'Modifier la destination'
                    : 'Edit Destination'
                  : isFr
                  ? 'Nouvelle destination'
                  : 'New Destination'}
              </h3>
              <button
                type="button"
                onClick={() => setShowDestModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Nom court' : 'Short Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={destForm.name}
                    onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                    placeholder="Paris"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Ville / Lieu' : 'Location'}
                  </label>
                  <input
                    type="text"
                    required
                    value={destForm.location}
                    onChange={(e) => setDestForm({ ...destForm, location: e.target.value })}
                    placeholder="Paris, France"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Pays' : 'Country'}
                  </label>
                  <input
                    type="text"
                    required
                    value={destForm.country}
                    onChange={(e) => setDestForm({ ...destForm, country: e.target.value })}
                    placeholder="France"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Titre fiche (EN)</label>
                  <input
                    type="text"
                    required
                    value={destForm.title}
                    onChange={(e) => setDestForm({ ...destForm, title: e.target.value })}
                    placeholder="Eiffel & Seine"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Titre fiche (FR)</label>
                  <input
                    type="text"
                    required
                    value={destForm.titleFr}
                    onChange={(e) => setDestForm({ ...destForm, titleFr: e.target.value })}
                    placeholder="Tour Eiffel & Seine"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Prix</label>
                  <input
                    type="text"
                    required
                    value={destForm.price}
                    onChange={(e) => setDestForm({ ...destForm, price: e.target.value })}
                    placeholder="$1,450"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Distance</label>
                  <input
                    type="text"
                    required
                    value={destForm.distance}
                    onChange={(e) => setDestForm({ ...destForm, distance: e.target.value })}
                    placeholder="3,620Km"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Temp.</label>
                  <input
                    type="text"
                    required
                    value={destForm.temp}
                    onChange={(e) => setDestForm({ ...destForm, temp: e.target.value })}
                    placeholder="22° C"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Note</label>
                  <input
                    type="text"
                    required
                    value={destForm.rating}
                    onChange={(e) => setDestForm({ ...destForm, rating: e.target.value })}
                    placeholder="4.9"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Tag (EN)</label>
                  <input
                    type="text"
                    value={destForm.tag}
                    onChange={(e) => setDestForm({ ...destForm, tag: e.target.value })}
                    placeholder="Popular"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Tag (FR)</label>
                  <input
                    type="text"
                    value={destForm.tagFr}
                    onChange={(e) => setDestForm({ ...destForm, tagFr: e.target.value })}
                    placeholder="Populaire"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Ordre' : 'Order'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10000}
                    value={destForm.order}
                    onChange={(e) => setDestForm({ ...destForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white font-mono tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1.5">
                  {isFr ? 'Catégories (sélectionner au moins 1)' : 'Categories (select at least 1)'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {DEST_CATEGORIES.map((cat) => {
                    const selected = destForm.categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          const exists = destForm.categories.includes(cat);
                          const next = exists
                            ? destForm.categories.filter((c) => c !== cat)
                            : [...destForm.categories, cat];
                          setDestForm({
                            ...destForm,
                            categories: next.length > 0 ? next : [cat],
                          });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                          selected
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-300">
                    {isFr ? 'Image principale (URL)' : 'Main Image URL'}
                  </label>
                  {files.some((f) => f.category === 'image') && (
                    <select
                      value=""
                      onChange={(e) => {
                        const chosen = files.find((f) => f.id === e.target.value);
                        if (chosen) {
                          setDestForm({
                            ...destForm,
                            mainImage:
                              chosen.storageMode === 'external'
                                ? chosen.externalUrl
                                : chosen.dataUrl,
                          });
                        }
                      }}
                      className="text-xs bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-blue-300"
                    >
                      <option value="">
                        {isFr ? 'Choisir depuis Fichiers...' : 'Pick from Files...'}
                      </option>
                      {files
                        .filter((f) => f.category === 'image')
                        .map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    required
                    value={destForm.mainImage}
                    onChange={(e) => setDestForm({ ...destForm, mainImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                  {destForm.mainImage && (
                    <img
                      src={destForm.mainImage}
                      alt="Preview"
                      className="w-10 h-10 rounded object-cover border border-slate-700 shrink-0"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  {isFr
                    ? 'Galerie miniatures (1 URL HTTPS par ligne, max 6)'
                    : 'Gallery Thumbnails (1 HTTPS URL per line, max 6)'}
                </label>
                <textarea
                  rows={3}
                  value={destForm.thumbnailsText}
                  onChange={(e) => setDestForm({ ...destForm, thumbnailsText: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  {isFr ? 'Lien de réservation (optionnel)' : 'Booking URL (optional)'}
                </label>
                <input
                  type="text"
                  value={destForm.bookingUrl}
                  onChange={(e) => setDestForm({ ...destForm, bookingUrl: e.target.value })}
                  placeholder="https://... (vide = défiler vers la recherche)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Description (EN)</label>
                  <textarea
                    rows={3}
                    required
                    value={destForm.description}
                    onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Description (FR)</label>
                  <textarea
                    rows={3}
                    required
                    value={destForm.descriptionFr}
                    onChange={(e) => setDestForm({ ...destForm, descriptionFr: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={destForm.active}
                    onChange={(e) => setDestForm({ ...destForm, active: e.target.checked })}
                  />
                  <span>{isFr ? 'Afficher publiquement' : 'Show publicly'}</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDestModal(false)}
                    className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 cursor-pointer"
                  >
                    {isFr ? 'Annuler' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={busyAction === 'save-dest'}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer"
                  >
                    {isFr ? 'Enregistrer' : 'Save Destination'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Review */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingReviewId
                  ? isFr
                    ? 'Modifier le témoignage'
                    : 'Edit Review'
                  : isFr
                  ? 'Nouveau témoignage'
                  : 'New Review'}
              </h3>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Nom auteur' : 'Author Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    placeholder="James Brown"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Catégorie' : 'Category'}
                  </label>
                  <select
                    value={reviewForm.category}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, category: e.target.value as ReviewCategory })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  >
                    <option value="flights">Flights</option>
                    <option value="hotels">Hotels</option>
                    <option value="cars">Cars</option>
                    <option value="airhelp">AirHelp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Note (1-5)' : 'Rating (1-5)'}
                  </label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, rating: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} / 5
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Role / Ville (EN)</label>
                  <input
                    type="text"
                    value={reviewForm.role}
                    onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                    placeholder="Frequent Traveler"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Rôle / Ville (FR)</label>
                  <input
                    type="text"
                    value={reviewForm.roleFr}
                    onChange={(e) => setReviewForm({ ...reviewForm, roleFr: e.target.value })}
                    placeholder="Voyageur régulier"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Titre avis (EN)</label>
                  <input
                    type="text"
                    value={reviewForm.headline}
                    onChange={(e) => setReviewForm({ ...reviewForm, headline: e.target.value })}
                    placeholder="Good Job!"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Titre avis (FR)</label>
                  <input
                    type="text"
                    value={reviewForm.headlineFr}
                    onChange={(e) => setReviewForm({ ...reviewForm, headlineFr: e.target.value })}
                    placeholder="Excellent travail !"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Style visuel de carte' : 'Card Layout Style'}
                  </label>
                  <select
                    value={reviewForm.cardStyle}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        cardStyle: e.target.value as ReviewCardStyle,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  >
                    {REVIEW_CARD_STYLES.map((st) => (
                      <option key={st.value} value={st.value}>
                        {isFr ? st.labelFr : st.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    {isFr ? 'Ordre d’affichage' : 'Display Order'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10000}
                    value={reviewForm.order}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, order: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white font-mono tabular-nums"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-300">Avatar (URL)</label>
                  {files.some((f) => f.category === 'image') && (
                    <select
                      value=""
                      onChange={(e) => {
                        const chosen = files.find((f) => f.id === e.target.value);
                        if (chosen) {
                          setReviewForm({
                            ...reviewForm,
                            avatar:
                              chosen.storageMode === 'external'
                                ? chosen.externalUrl
                                : chosen.dataUrl,
                          });
                        }
                      }}
                      className="text-xs bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-blue-300"
                    >
                      <option value="">
                        {isFr ? 'Choisir depuis Fichiers...' : 'Pick from Files...'}
                      </option>
                      {files
                        .filter((f) => f.category === 'image')
                        .map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    required
                    value={reviewForm.avatar}
                    onChange={(e) => setReviewForm({ ...reviewForm, avatar: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                  {reviewForm.avatar && (
                    <img
                      src={reviewForm.avatar}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Témoignage (EN)</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Témoignage (FR)</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewForm.textFr}
                    onChange={(e) => setReviewForm({ ...reviewForm, textFr: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewForm.active}
                    onChange={(e) => setReviewForm({ ...reviewForm, active: e.target.checked })}
                  />
                  <span>{isFr ? 'Afficher publiquement' : 'Show publicly'}</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 cursor-pointer"
                  >
                    {isFr ? 'Annuler' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={busyAction === 'save-review'}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer"
                  >
                    {isFr ? 'Enregistrer' : 'Save Review'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
