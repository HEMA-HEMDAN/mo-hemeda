import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const phoneNumber = "201029600193";
  const defaultMessage = "مرحبا! كيف يمكنني مساعدتك؟";
  const msg = encodeURIComponent(defaultMessage);

  const handleClick = (e) => {
    e.preventDefault();
    const url = `https://wa.me/${phoneNumber}?text=${msg}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Open WhatsApp chat"
      className="card fixed bottom-5 right-5 z-45 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[linear-gradient(to_bottom,#005A61_0%,#008A94_50%,#00B9C7_100%)] text-white shadow-xl transform transition-all duration-200
                 focus:outline-none focus:ring-4 focus:ring-green-300
                 hover:scale-105"
      title="تواصل عبر واتساب"
    >
      <span className="sr-only">Open WhatsApp</span>
      <FaWhatsapp size={22} />
    </button>
  );
};

export default WhatsAppButton;
