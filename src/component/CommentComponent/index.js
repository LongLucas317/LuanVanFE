import classNames from "classnames/bind";
import style from "./CommentComponent.module.scss";

import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useMutationHook } from "~/hooks/useMutationHook";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import * as message from "~/component/Message";
import * as UserService from "~/services/UserServices";
import * as CommentService from "~/services/CommentService";
import ModalComponent from "../ModalComponent";
import defaultAvt from "~/assets/img/avt.jpg";

const cx = classNames.bind(style);

function CommentComponent({ idProduct }) {
  const commentRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const [isComment, setIsComment] = useState(false);

  const handleShowCommentBtn = () => {
    setIsComment(true);
  };

  // Get All User ===================================================

  const getAllUser = async () => {
    const res = await UserService.getAllsUser(user?.access_token, "");

    return res?.data;
  };

  const queryUser = useQuery({
    queryKey: ["user"],
    queryFn: getAllUser,
  });

  const { data: users } = queryUser;

  // ================================================================

  // Get All Comment ================================================
  const [commentData, setCommentData] = useState([]);

  const fetchAllComment = async () => {
    const res = await CommentService.getAllComment(
      user?.access_token,
      idProduct
    );

    setCommentData(res);
  };

  useEffect(() => {
    fetchAllComment();
  }, []);

  // ================================================================

  // Update Comment =================================================
  const [mainInput, setMainInput] = useState("");
  const [idUpdateComment, setIdUpdateComment] = useState(null);

  const handleHideCommentBtn = () => {
    setMainInput("");
    setIsComment(false);
  };

  const handleGetCommentUpdate = (comment) => {
    commentRef.current.focus();
    setMainInput(comment?.content);
    setIdUpdateComment(comment?._id);
    setIsComment(true);
  };

  const mutationUpdateCmt = useMutationHook((data) => {
    const { cmtId, productId, userId, content, parentId } = data;
    const res = CommentService.updateComment(cmtId, user?.access_token, {
      productId,
      userId,
      content,
      parentId,
    });
    return res;
  });

  const {
    isLoading: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = mutationUpdateCmt;

  useEffect(() => {
    if (isUpdateSuccess) {
      message.success("Cập nhật bình luận thành công");
      fetchAllComment();
      setMainInput("");
      setIdUpdateComment(null);
      setIsComment(false);
    } else if (isUpdateError) {
      setIdUpdateComment(null);
      message.error("Đã xảy ra lỗi!!!");
    }
  }, [isUpdateSuccess, isUpdateError]);

  // ================================================================

  // Create Comment =================================================

  const handleOnChangeMainInput = (e) => {
    setMainInput(e.target.value);
  };

  const mutationCreateCmt = useMutationHook((data) => {
    const { productId, userId, content, parentId } = data;
    const res = CommentService.createComment(user?.access_token, {
      productId,
      userId,
      content,
      parentId,
    });
    return res;
  });

  const {
    isLoading,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = mutationCreateCmt;

  const handlePostComment = () => {
    if (!user?.id) {
      message.toastSuccess("Cần Đăng nhập trước khi Bình Luận");

      navigate("/sign-in", { state: location?.pathname });
      return;
    } else {
      if (idUpdateComment === null) {
        const params = {
          productId: idProduct,
          userId: user?.id,
          content: mainInput,
        };

        mutationCreateCmt.mutate(params);
      } else {
        const params = {
          cmtId: idUpdateComment,
          productId: idProduct,
          userId: user?.id,
          content: mainInput,
        };
        mutationUpdateCmt.mutate(params);
      }
    }
  };

  useEffect(() => {
    if (isCreateSuccess) {
      message.success("Bình luận thành công");
      fetchAllComment();
      setMainInput("");
    } else if (isCreateError) {
      message.error("Đã xảy ra lỗi!!!");
    }
  }, [isCreateSuccess, isCreateError]);

  // ================================================================

  // Delete Comment =================================================
  const [idDeleteCmt, setIdDeleteCmt] = useState(null);
  const [isDeleteCmt, setIsDeleteCmt] = useState(false);

  const handleOpenModalDeleteCmt = (id) => {
    setIdDeleteCmt(id);
    setIsDeleteCmt(true);
  };

  const handleCancelDeleteCmt = () => {
    setIsDeleteCmt(false);
    setIdDeleteCmt(null);
  };

  const handleDeleteComment = () => {
    setIsDeleteCmt(false);
    mutationDelete.mutate({ id: idDeleteCmt, token: user?.access_token });
  };

  const mutationDelete = useMutationHook((data) => {
    const { id, token } = data;
    const res = CommentService.deleteComment(id, token);
    return res;
  });

  const { isSuccess: isSuccessDeleted } = mutationDelete;

  useEffect(() => {
    if (isSuccessDeleted) {
      setIdDeleteCmt(null);
      message.success("Xóa bình luận thành công");
      fetchAllComment();
    }
  }, [isSuccessDeleted]);

  // ================================================================

  return (
    <div className={cx("comment__block")}>
      <div className={cx("comment__wrapper")}>
        <h5 className={cx("comment__header")}>Bình luận sản phẩm</h5>

        <div className={cx("comment__section")}>
          <div className={cx("main__comment")}>
            <div className={cx("input__section")}>
              <div className={cx("user__avatar")}>
                <img
                  src={user?.avatar ? user?.avatar : defaultAvt}
                  alt={user?.name}
                />
              </div>
              <input
                ref={commentRef}
                value={mainInput}
                onChange={handleOnChangeMainInput}
                onClick={handleShowCommentBtn}
                type="text"
                placeholder="Bình luận..."
              />
            </div>

            {isComment && (
              <div className={cx("action__btn")}>
                <button onClick={handlePostComment}>Bình luận</button>
                <button onClick={handleHideCommentBtn}>Hủy bỏ</button>
              </div>
            )}
          </div>

          <div className={cx("other__comments")}>
            {commentData?.map((comment) => {
              const userCmt = users?.filter(
                (user) => user?._id === comment?.userId
              );
              const userName = userCmt?.map((user) => user.name);
              const userAvt = userCmt?.map((user) => user.avatar);

              return (
                <div key={comment._id} className={cx("comment__group")}>
                  <div className={cx("input__section")}>
                    <div className={cx("user__avatar")}>
                      <img
                        src={userAvt ? userAvt : defaultAvt}
                        alt={userName}
                      />
                    </div>
                    <div className={cx("comment__content")}>
                      <h8>{userName}</h8>
                      <p>{comment?.content}</p>
                    </div>
                  </div>

                  <div className={cx("cmt__action")}>
                    {user?.id === comment?.userId && (
                      <p
                        onClick={() => handleGetCommentUpdate(comment)}
                        className={cx("update__btn")}
                      >
                        Chỉnh sửa
                      </p>
                    )}

                    {user?.id === comment?.userId && (
                      <p
                        onClick={() => handleOpenModalDeleteCmt(comment._id)}
                        className={cx("delete__btn")}
                      >
                        Xóa
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ModalComponent
        title="Xóa bình luận"
        open={isDeleteCmt}
        onCancel={handleCancelDeleteCmt}
        onOk={handleDeleteComment}
        forceRender
      >
        <div className={cx("delete__text")}>
          Bạn có chắc muốn xóa bình luận này không???
        </div>
      </ModalComponent>
    </div>
  );
}

export default CommentComponent;
