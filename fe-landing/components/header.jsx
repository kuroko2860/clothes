import { swalert, swtoast } from "@/mixins/swal.mixin";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaAngleDown, FaShoppingBag } from "react-icons/fa";

import logo from "@/public/img/logo.png";
import queries from "@/queries";
import customerService from "@/services/customerService";
import useCustomerStore from "@/store/customerStore";
import useCartStore from "@/store/cartStore"; // Add this import
import Login from "./login";
import Register from "./register";
import { BRANCH_NAME } from "@/helpers/config";

const Header = () => {
  const [isLogInOpen, setIsLogInOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const isLoggedIn = useCustomerStore((state) => state.isLoggedIn);
  const setCustomerLogout = useCustomerStore(
    (state) => state.setCustomerLogout
  );

  const { isError, error, data } = useQuery({
    ...queries.categories.list(),
  });
  if (isError) console.log(error);
  const categoryList = data?.data;

  const toClose = () => {
    setIsLogInOpen(false);
    setIsRegisterOpen(false);
  };

  return (
    <div className="header-wrapper position-relation">
      {!isLoggedIn && (
        <>
          <div className={!isLogInOpen ? `${"d-none"}` : ""}>
            <Login
              toRegister={() => {
                setIsLogInOpen(false);
                setIsRegisterOpen(true);
              }}
              toClose={toClose}
            />
          </div>
          <div className={!isRegisterOpen ? `${"d-none"}` : ""}>
            <Register
              toLogin={() => {
                setIsRegisterOpen(false);
                setIsLogInOpen(true);
              }}
              toClose={toClose}
            />
          </div>
        </>
      )}
      <div className="header w-100 d-flex align-items-center">
        <div className="logo-box p-2">
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "#000",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "36px",
            }}
          >
            {BRANCH_NAME}
          </Link>
        </div>
        <ul className="menu p-2">
          <li className="menu-item fw-bold text-uppercase position-relative">
            <Link href="/collections" className="d-flex align-items-center">
              Tất cả
            </Link>
          </li>
          {categoryList &&
            categoryList.map((categoryLevel1, index) => {
              return (
                <li
                  className="menu-item fw-bold text-uppercase position-relative"
                  key={index}
                >
                  <Link href="#" className="d-flex align-items-center">
                    {categoryLevel1.title}
                    <span>
                      <FaAngleDown />
                    </span>
                  </Link>
                  <ul className="sub-menu position-absolute">
                    {categoryLevel1.children &&
                      categoryLevel1.children.map((category, index) => {
                        return (
                          <li key={index} className="w-100">
                            <Link
                              href={{
                                pathname: "/collections",
                                query: {
                                  category: category.category_id,
                                },
                              }}
                            >
                              {category.title}
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                </li>
              );
            })}
        </ul>

        <ul className="header-inner p-2 ms-auto">
          {!isLoggedIn ? (
            <li
              onClick={() => {
                setIsLogInOpen(true);
              }}
              className="inner-item menu-item fw-bold text-uppercase"
            >
              <a href="#" className="text-decoration-none">
                Đăng Nhập
              </a>
            </li>
          ) : (
            <>
              <li className="inner-item menu-item fw-bold text-uppercase">
                <Link href="/account/infor" className="text-decoration-none">
                  Account
                </Link>
              </li>
              <li
                onClick={() => {
                  swalert
                    .fire({
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      showCancelButton: true,
                      showLoaderOnConfirm: true,
                      preConfirm: async () => {
                        try {
                          await customerService.logout();
                          return { isError: false };
                        } catch (error) {
                          console.log(error);
                          return { isError: true };
                        }
                      },
                      title: "Đăng xuất",
                      icon: "warning",
                      text: "Bạn muốn đăng xuất?",
                    })
                    .then(async (result) => {
                      if (result.isConfirmed && !result.value?.isError) {
                        setCustomerLogout();
                        swtoast.success({ text: "Đăng xuất thành công!" });
                      } else if (result.isConfirmed && result.value?.isError) {
                        setCustomerLogout();
                        swtoast.success({ text: "Đăng xuất thành công!" });
                      }
                    });
                }}
                className="inner-item menu-item fw-bold text-uppercase"
              >
                <a href="#" className="text-decoration-none">
                  Log Out
                </a>
              </li>
            </>
          )}
          <ShoppingBagIcon />
        </ul>
      </div>
    </div>
  );
};

const ShoppingBagIcon = () => {
  // Get cart items from the cart store
  const cartItems = useCartStore((state) => state.productList);
  const isLoggedIn = useCustomerStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return (
      <div className="cart inner-item menu-item fw-bold text-uppercase">
        <Link href="/cart" className="text-decoration-none">
          <FaShoppingBag />
          {/* <span className="cart-count">0</span> */}
        </Link>
      </div>
    );
  }

  // Calculate total quantity of items in cart
  const itemCount =
    cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <div className="cart inner-item menu-item fw-bold text-uppercase">
      <Link href="/cart" className="text-decoration-none">
        <FaShoppingBag />
        <span className="cart-count">{itemCount}</span>
      </Link>
    </div>
  );
};

export default Header;
