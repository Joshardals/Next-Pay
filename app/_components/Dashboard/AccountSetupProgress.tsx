import { BsCheck2Circle } from "react-icons/bs";
import { HiOutlineArrowRight } from "react-icons/hi";

export function AccountSetupProgress() {
  return (
    <div className="w-full">
      <div className="bg-charcoal rounded-2xl py-6 xl:p-6 xl:sticky xl:top-6">
        <h3 className="text-xl font-medium text-snow mb-2">
          Complete Your Setup
        </h3>
        <p className="text-lightGray text-sm mb-6">
          Finish these steps to start trading
        </p>

        <div className="flex justify-between text-sm text-lightGray mb-2">
          <span>Progress</span>
          <span className="font-medium">2/4 Steps</span>
        </div>
        <div className="h-2 bg-darkCharcoal rounded-full mb-8">
          <div className="h-full w-1/2 bg-gradient-to-r from-goldenrod to-yellow-400 rounded-full"></div>
        </div>

        <div className="flex flex-col gap-4">
          {[
            { status: "completed", text: "Create a Nex Pay Account" },
            { status: "completed", text: "Verify Your Info" },
            { status: "active", text: "Add Payment Method" },
            { status: "pending", text: "Buy Stocks" },
          ].map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all
                ${step.status === "active" ? "bg-darkCharcoal" : ""}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center
                ${
                  step.status === "completed"
                    ? "bg-green-500/20"
                    : "bg-darkGray/20"
                }`}
              >
                {step.status === "completed" ? (
                  <BsCheck2Circle className="text-green-500" size={16} />
                ) : (
                  <span className="text-snow text-sm">{index + 1}</span>
                )}
              </div>
              <span className="text-sm text-snow flex-1">{step.text}</span>
              {step.status !== "completed" && (
                <HiOutlineArrowRight className="text-lightGray" size={18} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
