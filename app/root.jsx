import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "~/tailwind.css";
import globalStylesUrl from "~/styles/global.css";
import logo from "~/assets/logo.png";
export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "stylesheet",
    href: globalStylesUrl,
  }
];

export function meta() {
  return {
    charset: "utf-8",
    title: "Remix + MongoDB",
    viewport: "width=device-width,initial-scale=1",
  };
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 text-slate-800 font-sans p-4">
        <div className="mb-4 pb-4 border-b flex justify-between">
            <img src={logo} alt="logo"></img>
            <div>
            <Link to="/register" className="register">
            Register
          </Link>
          <Link to="/login" className="login">
            Sign In
          </Link>
            </div>
          </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
