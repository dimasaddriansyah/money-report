import { useBalance } from "../../../shared/context/BalanceContext";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import type { Account } from "../../accounts/types/account";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { getAccountsImg } from "../../../shared/utils/style.helper";

type AccountWithBalance = Account & {
  balance: number;
};

type Props = {
  accounts: AccountWithBalance[];
};

export default function DashboardSectionAccountBalanceSummary({ accounts }: Props) {
  const { hideBalance } = useBalance();

  return (
    <div className="min-w-0">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={12}
        slidesPerView="auto"
        loop={true}
        speed={4000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        allowTouchMove={true}>
        {accounts.map((row) => (
          <SwiperSlide key={row.id} className="w-auto!">
            <div className="min-w-60 p-4 bg-white hover:bg-slate-100 rounded-lg border border-slate-100 cursor-pointer">
              <div className="flex items-center gap-4">
                <img src={getAccountsImg(row.name)} alt={row.name} className="w-8 h-8" />
                <div className="flex flex-col text-sm">
                  <span className="font-medium">
                    {formatBalance(formatCurrency(row.balance), hideBalance)}
                  </span>
                  <span className="text-slate-400">{row.name}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}