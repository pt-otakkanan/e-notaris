import TemplatePointers from "./components/TemplatePointers";

function LandingIntro() {
  return (
    <div
      className="hero min-h-full rounded-l-xl"
      style={{ backgroundColor: "#96696d" }}
    >
      <div className="hero-content p-0 gap-0 mt-6 mb-0">
        <div className="text-center p-0 m-0">
          <div className="text-center mt-0">
            <img
              src="logo-enotaris.png"
              alt="Dashwind Admin Template"
              className="w-48 inline-block mt-[50px]"
            ></img>
          </div>
          {/* Importing pointers component */}
          <TemplatePointers />
        </div>
      </div>
    </div>
  );
}

export default LandingIntro;
