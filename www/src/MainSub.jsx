import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firebaseApp } from "./firebase";
import {
  collection,
  doc,
  getFirestore,
  setDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";

import "./MainSub.css";

function UnsubButton({ userSubDoc }) {
  return (
    <div className={`btn unsub-btn`} onClick={() => deleteDoc(userSubDoc)}>
      구독 취소
    </div>
  );
}

function MainSub() {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  const subCol = collection(firestore, "subscribers");

  const [user] = useAuthState(auth);
  const userSubDoc = doc(subCol, user.uid);
  const [subData, loading] = useDocumentData(userSubDoc);

  const [cboxSubscribe, setCboxSubscribe] = useState(true);

  console.log(subData, loading);

  // 구독 함수
  const subAction = () => {
    setDoc(userSubDoc, {
      email: user.email,
      name: user.displayName,
      updated: serverTimestamp(),
    });
  };

  if (loading) if (loading) return <div className="loading">Loading...</div>;
  return (
    <div className="MainSub">
      <div className="subList">
        <label>
          <input
            type="checkbox"
            name="cbox_subscribe"
            id="cbox_subscribe"
            checked={cboxSubscribe}
            disabled={subData}
            onChange={(e) => setCboxSubscribe(e.target.checked)}
          />{" "}
          전체 메일링 리스트 구독
        </label>
        {subData ? (
          <UnsubButton userSubDoc={userSubDoc} />
        ) : (
          <div
            className={`btn sub-btn ${cboxSubscribe && "activate"}`}
            onClick={cboxSubscribe ? subAction : undefined}
          >
            구독 신청
          </div>
        )}
        <div className="small">
          {user.email} 으로 매일 7시마다 전송됩니다. <br />
          <a onClick={() => auth.signOut()} href="javascript:void()">
            [로그아웃]
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainSub;
