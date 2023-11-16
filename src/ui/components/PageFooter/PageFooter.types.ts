interface PageFooterProps {
  pageId?: string;
  dataTestId?: string;
  primaryButtonText?: string;
  primaryButtonAction?: () => void;
  primaryButtonDisabled?: boolean;
  secondaryButtonText?: string;
  secondaryButtonAction?: () => void;
  secondaryButtonDisabled?: boolean;
  tertiaryButtonText?: string;
  tertiaryButtonAction?: () => void;
  tertiaryButtonDisabled?: boolean;
}

export type { PageFooterProps };