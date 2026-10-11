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

export const Section: FC<{
  heading: string
  compact?: boolean
  children: ReactNode
}> = ({ heading, compact = false, children }) => (
  <section style={{ display: "grid", gap: compact ? ".875rem" : "1.125rem" }}>
    <h2
      style={{
        borderTop: `1px solid ${theme.text}`,
        fontSize: compact ? "1.25rem" : "1.5rem",
        lineHeight: 1.45,
        margin: 0,
        paddingTop: ".75rem",
      }}
    >
      {heading}
    </h2>
    {children}
  </section>
)

export const Header: FC<{ children: ReactNode }> = ({ children }) => (
  <header className="site-header">
    <div className="site-header__inner">{children}</div>
  </header>
)

export const Main: FC<{ children: ReactNode }> = ({ children }) => (
  <main className="site-main">{children}</main>
)

export const Footer: FC<{ children: ReactNode }> = ({ children }) => (
  <footer className="site-footer">
    <div className="site-footer__inner">{children}</div>
  </footer>
)
