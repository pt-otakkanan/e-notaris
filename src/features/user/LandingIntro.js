import TemplatePointers from "./components/TemplatePointers";

function LandingIntro() {
  return (
    <div
      className="hero min-h-full rounded-none md:rounded-l-xl"
      style={{ backgroundColor: "#0256c4" }}
    >
      <div className="hero-content p-0 gap-0 mt-6 mb-0">
        <div className="text-center p-0 m-0 relative">
          <div className="text-center mt-0">
            <img
              src="logo-enotaris.png"
              alt="Logo E-Notaris"
              className="w-48 inline-block mt-[60px]"
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
