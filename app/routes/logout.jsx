import { redirect } from "@remix-run/node";
import { useCatch } from "@remix-run/react";
import { destroySession, getSession } from "./session.js";
//import CatchBoundary from "~/components/CatchBoundary";

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export function loader() {
  return redirect("/login");
}


export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div className="w-full p-8 bg-white">
      <div>
        <h2>
          <b>{caught.data}</b>
        </h2>
        <p>
          This page is unavailable. Please try again when you regain
          connectivity.
        </p>
      </div>
    </div>
  );
}