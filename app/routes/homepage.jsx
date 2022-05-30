import { LiveReload,Form,
    Outlet } from "@remix-run/react";
  import img from "~/assets/img.jpeg";
  import {  redirect } from "@remix-run/node";
  
  export async function action({request}){
    const form = await request.formData();
    const jobType = form.get("jobType");
    const skills = form.get("skills");
    const sortType = form.get("sort");
     return redirect(`homepage/${jobType}%20${skills}%20${sortType}`);
  }
  
  export default function Search() {
    return (
      <div style={{
        background:"white",
        height:"100%"
      }}>
         <div className="mb-4 pb-4 border-b flex justify-between" style={
                     {
                         background:"white",
                         width:"70%",
                     }
                 }>
                     <img src={img} alt="img" className="img"></img>
                     <div >
                          <div className="chenar">
                              <i className="text">The journey starts now with <b>Junior Venture!</b></i>
                          </div>
                          <i className="subText">Find your web developer with Junior Venture!</i>
                     </div>
          </div>
            <Form method="post">
            <b>Search By</b>
            <select id="job" name="jobType" className="careerField" text="test">
                <option value="" disabled selected>Looking for(required)</option>
                <option value="internship">Internship</option>
                <option value="job">Job</option>
            </select>
            <select id="career" name="careerField" className="careerField" text="test">
                <option value="" disabled selected>Career Field</option>
                <option value="career">Web Developer</option>
            </select>
            <input type="text" placeholder="Skills" className="careerField placeholder" name="skills" style={{textcolor:"black"}}></input>
            <select id="job" name="sort" className="careerField" text="test">
                <option value="" disabled selected>Sort By</option>
                <option value="alphabetical">Name: Alphabetical</option>
                <option value="newest">newest</option>
            </select>
            <button
              className="createAccount"
              type="submit"
              style={{
                marginTop:"5%"
              }}
              >
                Search
             </button>
            </Form>
          <LiveReload />
          <Outlet/>
      </div>
    );
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
  