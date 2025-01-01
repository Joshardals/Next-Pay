export function Chart() {
  return (
    <div className="md:w-[40%] h-[500px] relative bg-charcoal/30 rounded-lg backdrop-blur-sm p-6">
      <svg className="w-full h-full" viewBox="0 0 400 300">
        {/* Animated line chart */}
        <path
          d="M 0,150 Q 50,150 100,100 T 200,80 T 300,120 T 400,50"
          fill="none"
          stroke="#E5C07B"
          strokeWidth="3"
          className="animate-draw"
        />
        {/* Stock price indicators */}
        <g className="animate-fade-in">
          <circle cx="100" cy="100" r="4" fill="#E5C07B" />
          <circle cx="200" cy="80" r="4" fill="#E5C07B" />
          <circle cx="300" cy="120" r="4" fill="#E5C07B" />
        </g>
        {/* Price labels */}
        <g className="text-sm fill-lightGray">
          <text x="90" y="90">
            $450
          </text>
          <text x="190" y="70">
            $580
          </text>
          <text x="290" y="110">
            $420
          </text>
        </g>
      </svg>

      {/* Floating cards */}
      <div className="absolute top-10 right-10 bg-charcoal/70 p-4 rounded-lg animate-float">
        <div className="text-snow text-sm">AAPL</div>
        <div className="text-goldenrod text-lg">+2.4%</div>
      </div>
      <div className="absolute bottom-10 left-10 bg-charcoal/70 p-4 rounded-lg animate-float-delayed">
        <div className="text-snow text-sm">TSLA</div>
        <div className="text-goldenrod text-lg">+1.8%</div>
      </div>
    </div>
  );
}
