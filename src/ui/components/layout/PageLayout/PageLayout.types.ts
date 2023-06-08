import { ReactNode } from "react";

interface PageLayoutProps {
  header?: boolean;
  backButton?: boolean;
  onBack?: () => void;
  currentPath: string;
  children?: ReactNode;
  closeButton?: boolean;
  closeButtonAction?: () => void;
  progressBar?: boolean;
  progressBarValue?: number;
  progressBarBuffer?: number;
  title?: string;
  menuButton?: boolean;
  footer?: boolean;
  primaryButtonText?: string;
  primaryButtonAction?: () => void;
  primaryButtonDisabled?: boolean;
}

export type { PageLayoutProps };