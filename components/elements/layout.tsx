import { theme } from "@/lib/theme"
import { ComponentProps, FC, ReactNode } from "react"

const Container: FC<{ children: ReactNode }> = ({ children }) => (
  <div style={{ margin: "0 auto", maxWidth: theme.maxWidth }}>{children}</div>
)

export const Title: FC<ComponentProps<"h1">> = ({
  style,
  children,
  ...props
}) => (
  <h1 style={{ fontSize: "1rem", margin: 0, ...style }} {...props}>
    {children}
  </h1>
)

export const Section: FC<{
  heading: string
  compact?: boolean
  children: ReactNode
}> = ({ heading, compact = false, children }) => (
  <section style={{ display: "grid", gap: compact ? ".625rem" : "1rem" }}>
    <h2
      style={{
        borderBottom: `1px solid ${theme.border}`,
        fontSize: compact ? ".9375rem" : "1.0625rem",
        margin: 0,
        paddingBottom: compact ? ".4rem" : ".5rem",
      }}
    >
      {heading}
    </h2>
    {children}
  </section>
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
    <Container>{children}</Container>
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
    <Container>{children}</Container>
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
    <Container>{children}</Container>
  </footer>
)
