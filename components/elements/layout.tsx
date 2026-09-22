import { theme } from "@/lib/theme"
import { ComponentProps, FC, ReactNode } from "react"

export const Title: FC<ComponentProps<"h1">> = ({
  style,
  children,
  ...props
}) => (
  <h1 style={{ fontSize: "1rem", margin: 0, ...style }} {...props}>
    {children}
  </h1>
)

export const Header: FC<{ children: ReactNode }> = ({ children }) => (
  <header
    style={{
      backgroundColor: theme.surface,
      borderBottom: `1px solid ${theme.border}`,
      borderTop: `3px solid ${theme.text}`,
      padding: "1rem 1.25rem",
      position: "relative",
    }}
  >
    <div style={{ margin: "0 auto", maxWidth: theme.maxWidth }}>{children}</div>
  </header>
)

export const Main: FC<{ children: ReactNode }> = ({ children }) => (
  <main
    style={{
      background: theme.background,
      minHeight: "calc(100dvh - 8rem)",
      padding: "2.5rem 1.25rem 4rem",
    }}
  >
    <div style={{ margin: "0 auto", maxWidth: theme.maxWidth }}>{children}</div>
  </main>
)

export const Footer: FC<{ children: ReactNode }> = ({ children }) => (
  <footer
    style={{
      backgroundColor: theme.surface,
      borderTop: `1px solid ${theme.border}`,
      color: theme.muted,
      fontSize: ".75rem",
      padding: "1.25rem",
    }}
  >
    <div style={{ margin: "0 auto", maxWidth: theme.maxWidth }}>{children}</div>
  </footer>
)
