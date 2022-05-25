import { useLoaderData, Link } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";


export default function Index() {
  const books = useLoaderData();

  return (
    <div>
      
    </div>
  );
}

