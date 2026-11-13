import React from "react";

// =============================================================================
// CUTE CARTOON RATION / KIRANA VECTOR ICONS
// Vibrant, lo-fi, hand-crafted shopkeeper aesthetic
// =============================================================================

export function AttaSackIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Burlap Sack Body */}
      <path
        d="M16 26C16 22 22 18 32 18C42 18 48 22 48 26C48 36 52 50 48 54C44 58 20 58 16 54C12 50 16 36 16 26Z"
        fill="#F59E0B"
        stroke="#78350F"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sack Tie Neck */}
      <path
        d="M22 18C24 13 40 13 42 18C40 20 24 20 22 18Z"
        fill="#D97706"
        stroke="#78350F"
        strokeWidth="2.5"
      />
      {/* Tied String Bow */}
      <path
        d="M26 18C22 14 20 10 24 10C28 10 28 17 32 18C36 17 36 10 40 10C44 10 42 14 38 18"
        stroke="#78350F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Wheat Sheaf Doodle on Sack */}
      <path
        d="M32 30V46M32 34L26 31M32 38L38 35M32 42L26 39"
        stroke="#FEF3C7"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Text Stamp "ATTA" */}
      <rect x="22" y="47" width="20" height="7" rx="3.5" fill="#78350F" />
      <text x="32" y="52.5" fill="#FEF3C7" fontSize="5.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        आटा
      </text>
    </svg>
  );
}

export function MustardOilIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Oil Bottle Body */}
      <rect
        x="18"
        y="22"
        width="28"
        height="36"
        rx="6"
        fill="#FBBF24"
        stroke="#78350F"
        strokeWidth="3"
      />
      {/* Bottle Neck */}
      <path
        d="M26 14H38V22H26V14Z"
        fill="#FDE68A"
        stroke="#78350F"
        strokeWidth="2.5"
      />
      {/* Bottle Cap */}
      <rect x="24" y="9" width="16" height="5" rx="2" fill="#DC2626" stroke="#78350F" strokeWidth="2" />
      {/* Label */}
      <rect x="21" y="28" width="22" height="22" rx="3" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
      {/* Golden Oil Drop */}
      <path
        d="M32 33C32 33 27 38 27 41C27 43.8 29.2 46 32 46C34.8 46 37 43.8 37 41C37 38 32 33 32 33Z"
        fill="#F59E0B"
      />
      {/* Little Sparkle */}
      <circle cx="34" cy="39" r="1" fill="#FEF3C7" />
    </svg>
  );
}

export function ChaiPattiIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Tea Box */}
      <rect
        x="14"
        y="16"
        width="26"
        height="38"
        rx="4"
        fill="#047857"
        stroke="#064E3B"
        strokeWidth="3"
      />
      {/* Gold Label Band */}
      <rect x="14" y="26" width="26" height="18" fill="#F59E0B" />
      <text x="27" y="38" fill="#78350F" fontSize="6" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        चाय
      </text>
      {/* Tea Leaf on Box */}
      <path
        d="M27 20C24 22 24 25 27 25C30 25 30 22 27 20Z"
        fill="#A7F3D0"
        stroke="#064E3B"
        strokeWidth="1.5"
      />
      {/* Cutting Chai Glass on Right */}
      <path
        d="M44 32L46 54H54L56 32H44Z"
        fill="#FDE68A"
        stroke="#78350F"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Chai Liquid Fill */}
      <path d="M45.5 38L47 52H53L54.5 38H45.5Z" fill="#B45309" />
      {/* Steam curls */}
      <path
        d="M47 28C47 25 50 25 50 22M52 29C52 26 55 26 55 23"
        stroke="#D97706"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DesiGheeIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Traditional Golden Ghee Pot / Matka */}
      <path
        d="M20 22C20 18 24 16 32 16C40 16 44 18 44 22C48 26 52 38 48 48C44 56 20 56 16 48C12 38 16 26 20 22Z"
        fill="#FBBF24"
        stroke="#78350F"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Pot Rim */}
      <ellipse cx="32" cy="18" rx="14" ry="4" fill="#F59E0B" stroke="#78350F" strokeWidth="2.5" />
      {/* Golden Ghee Overflow / Texture */}
      <ellipse cx="32" cy="18" rx="10" ry="2.5" fill="#FEF3C7" />
      {/* Traditional Sun/Swastik Stamp */}
      <circle cx="32" cy="36" r="8" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
      <text x="32" y="39.5" fill="#78350F" fontSize="6" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        घी
      </text>
      {/* Dipper / Ladle Handle */}
      <path d="M38 16L48 6" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function MasalaPackIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Spices Pouch */}
      <path
        d="M18 18L14 54H50L46 18H18Z"
        fill="#EF4444"
        stroke="#7F1D1D"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Pouch Crimp Top */}
      <path
        d="M16 18H48M16 14H48"
        stroke="#7F1D1D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Pouch Label */}
      <rect x="20" y="24" width="24" height="22" rx="3" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
      {/* Cartoon Red Chili */}
      <path
        d="M26 40C26 34 32 30 38 28C38 34 34 40 28 42C26.5 42.5 25.5 41.5 26 40Z"
        fill="#DC2626"
      />
      {/* Chili Green Stem */}
      <path d="M38 28C40 26 42 27 41 29" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
      <text x="32" y="44" fill="#78350F" fontSize="4.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        मसाला
      </text>
    </svg>
  );
}

export function DalBowlIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Golden Dal Bag */}
      <path
        d="M16 26C16 22 22 18 32 18C42 18 48 22 48 26C48 38 52 50 48 54C44 58 20 58 16 54C12 50 16 38 16 26Z"
        fill="#FDE68A"
        stroke="#78350F"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Open Rim of Dal Bag showing yellow lentils */}
      <ellipse cx="32" cy="24" rx="14" ry="5" fill="#F59E0B" stroke="#78350F" strokeWidth="2.5" />
      {/* Individual Lentil grains */}
      <circle cx="28" cy="24" r="1.5" fill="#FEF3C7" />
      <circle cx="33" cy="23" r="1.5" fill="#FEF3C7" />
      <circle cx="36" cy="25" r="1.5" fill="#FEF3C7" />
      <circle cx="30" cy="26" r="1.5" fill="#FEF3C7" />
      {/* Badge label */}
      <rect x="22" y="36" width="20" height="12" rx="3" fill="#B45309" />
      <text x="32" y="44" fill="#FEF3C7" fontSize="5.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        दाल
      </text>
    </svg>
  );
}

export function ChiniBagIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Sugar Bag */}
      <rect x="18" y="20" width="28" height="36" rx="5" fill="#E0F2FE" stroke="#0369A1" strokeWidth="3" />
      {/* Rolled top */}
      <path d="M16 20C16 16 48 16 48 20" stroke="#0369A1" strokeWidth="3" strokeLinecap="round" />
      {/* Sugar Cube Doodles */}
      <rect x="24" y="28" width="6" height="6" rx="1" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
      <rect x="33" y="26" width="6" height="6" rx="1" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
      <rect x="28" y="34" width="6" height="6" rx="1" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
      {/* Label */}
      <rect x="22" y="44" width="20" height="8" rx="2" fill="#0284C7" />
      <text x="32" y="50" fill="#FFFFFF" fontSize="5.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        चीनी
      </text>
    </svg>
  );
}

export function BiscuitPackIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Biscuit Packet */}
      <rect x="12" y="22" width="40" height="26" rx="4" fill="#F59E0B" stroke="#78350F" strokeWidth="3" />
      {/* Packet Crimp edges */}
      <path d="M12 22L8 25L12 28L8 31L12 34L8 37L12 40L8 43L12 48" stroke="#78350F" strokeWidth="2" />
      <path d="M52 22L56 25L52 28L56 31L52 34L56 37L52 40L56 43L52 48" stroke="#78350F" strokeWidth="2" />
      {/* Center Biscuit Graphic */}
      <rect x="20" y="27" width="24" height="16" rx="2" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
      {/* Biscuit Dots */}
      <circle cx="25" cy="32" r="1" fill="#78350F" />
      <circle cx="32" cy="32" r="1" fill="#78350F" />
      <circle cx="39" cy="32" r="1" fill="#78350F" />
      <circle cx="25" cy="38" r="1" fill="#78350F" />
      <circle cx="32" cy="38" r="1" fill="#78350F" />
      <circle cx="39" cy="38" r="1" fill="#78350F" />
    </svg>
  );
}

export function SabunBarIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Soap Bar */}
      <rect x="14" y="22" width="36" height="26" rx="7" fill="#6EE7B7" stroke="#065F46" strokeWidth="3" />
      {/* Gloss curve */}
      <path d="M18 28C22 25 32 25 46 28" stroke="#A7F3D0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Soap bubbles */}
      <circle cx="48" cy="18" r="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
      <circle cx="53" cy="25" r="2.5" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
      <circle cx="44" cy="13" r="2" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1" />
      {/* Stamp text */}
      <text x="32" y="38" fill="#065F46" fontSize="6" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        साबुन
      </text>
    </svg>
  );
}

export function KhataBookIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Traditional Red Velvet Indian Khata Notebook */}
      <rect x="14" y="10" width="36" height="46" rx="4" fill="#DC2626" stroke="#7F1D1D" strokeWidth="3" />
      {/* Book Binding Strip on Left */}
      <rect x="14" y="10" width="8" height="46" rx="2" fill="#991B1B" />
      {/* Golden Thread Binder Stitch */}
      <line x1="18" y1="14" x2="18" y2="52" stroke="#FBBF24" strokeWidth="2" strokeDasharray="3 3" />
      {/* Golden Corners */}
      <path d="M14 18L22 10" stroke="#FBBF24" strokeWidth="2" />
      <path d="M42 10L50 18" stroke="#FBBF24" strokeWidth="2" />
      <path d="M42 56L50 48" stroke="#FBBF24" strokeWidth="2" />
      {/* Center Auspicious Shubh Labh / Tilak Emblem */}
      <circle cx="34" cy="30" r="9" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
      <text x="34" y="33" fill="#B45309" fontSize="6.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        खाता
      </text>
      {/* Golden Bookmark Ribbon hanging down */}
      <path d="M30 54V60L33 57L36 60V54" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
    </svg>
  );
}

export function ShopkeeperMascot({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Cute Cartoon Shopkeeper Mascot (दुकानदार भैया) */}
      {/* Body / Kurta */}
      <path
        d="M14 58C14 46 22 42 32 42C42 42 50 46 50 58H14Z"
        fill="#047857"
        stroke="#064E3B"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Kurta Collar */}
      <path d="M28 42L32 48L36 42" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round" />
      {/* Smiling Friendly Face */}
      <circle cx="32" cy="28" r="16" fill="#FDE68A" stroke="#78350F" strokeWidth="3" />
      {/* Red Tilak on Forehead */}
      <path d="M32 17V22" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="24" r="1.2" fill="#F59E0B" />
      {/* Friendly Eyes */}
      <circle cx="26" cy="26" r="2" fill="#78350F" />
      <circle cx="38" cy="26" r="2" fill="#78350F" />
      <circle cx="27" cy="25" r="0.6" fill="#FFFFFF" />
      <circle cx="39" cy="25" r="0.6" fill="#FFFFFF" />
      {/* Traditional Indian Twirly Mustache */}
      <path
        d="M23 33C26 31 30 33 32 35C34 33 38 31 41 33C43 34 40 37 36 36C33 35 32 37 32 37C32 37 31 35 28 36C24 37 21 34 23 33Z"
        fill="#78350F"
      />
      {/* Warm Smile */}
      <path d="M28 38C30 40 34 40 36 38" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      {/* Red Kirana Khata tucked in hand */}
      <rect x="42" y="44" width="12" height="15" rx="2" fill="#DC2626" stroke="#7F1D1D" strokeWidth="2" />
      <line x1="45" y1="44" x2="45" y2="59" stroke="#FEF3C7" strokeWidth="1" />
    </svg>
  );
}

// =============================================================================
// HELPER TO INTELLIGENTLY PICK A RATION CARTOON ICON
// =============================================================================
export function getRationItemIcon(itemName: string, className: string = "w-8 h-8") {
  const name = (itemName || "").toLowerCase();

  if (name.includes("atta") || name.includes("flour") || name.includes("wheat") || name.includes("maida")) {
    return <AttaSackIcon className={className} />;
  }
  if (name.includes("oil") || name.includes("tel") || name.includes("mustard") || name.includes("sarson")) {
    return <MustardOilIcon className={className} />;
  }
  if (name.includes("tea") || name.includes("chai") || name.includes("patti")) {
    return <ChaiPattiIcon className={className} />;
  }
  if (name.includes("ghee") || name.includes("butter") || name.includes("makhan")) {
    return <DesiGheeIcon className={className} />;
  }
  if (name.includes("masala") || name.includes("chili") || name.includes("mirch") || name.includes("turmeric") || name.includes("haldi") || name.includes("spice")) {
    return <MasalaPackIcon className={className} />;
  }
  if (name.includes("dal") || name.includes("pulse") || name.includes("lentil") || name.includes("chana") || name.includes("moong") || name.includes("toor")) {
    return <DalBowlIcon className={className} />;
  }
  if (name.includes("sugar") || name.includes("chini") || name.includes("shakar") || name.includes("rice") || name.includes("chawal")) {
    return <ChiniBagIcon className={className} />;
  }
  if (name.includes("biscuit") || name.includes("parle") || name.includes("cookie") || name.includes("snack") || name.includes("rusk")) {
    return <BiscuitPackIcon className={className} />;
  }
  if (name.includes("soap") || name.includes("sabun") || name.includes("surf") || name.includes("detergent") || name.includes("rin")) {
    return <SabunBarIcon className={className} />;
  }

  // Default to the classic Khata Book
  return <KhataBookIcon className={className} />;
}
