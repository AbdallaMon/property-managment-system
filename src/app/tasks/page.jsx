"use client";
import React, { useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";

const initialTasks = [
  {
    title: "اضافة خصم للعقد ",
    done: true,
  },
  {
    title: "اضافة العقود المنتيه المدة وايضا فصل كل شيء عن الاخر ",
    done: true,
  },
  {
    title: "بعض الحقول في جدول الصيانه غير ظاهره",
    done: false,
  },
  {
    title: "حل مشكلة عدادت الكهرباء",
    done: true,
  },
  {
    title:
      "عند طباعة اي جدول يتم طباعة الجدول باكملة لان حاليا بيطبع جزء بسبب ال scroll",
    done: true,
  },
  {
    title:
      "عند حذف عنصر من الجدول في الصفحة الثاتية مثلا لا يجب ان يعود الي اول صفحة بل يجب ان يظل في نفس الصفحة",
    done: false,
  },
  {
    title:
      "تعديل الدفعات بحيث تكون البدايه مع بداية العقد وليس بعد شهور من التسجيل ",
    done: true,
  },

  {
    title: "بعد انشاء الوحده يتم التحويل الي صفحة الوحدات ",
    done: false,
  },
  {
    title: "العقود المنتهية ",
    done: true,
  },
  {
    title: " صفحة تعديل العقار بها مشكله لا يتم الحفظ ",
    done: false,
  },
  {
    title: "مرفقات العقد ",
    done: false,
  },
  {
    title:
      "حول في الدفعه الي شيك  او تحويل بنكي والاتنين لازم حساب حساب بنكي  محتاجين نضيف الجزء ده في الscheme",
    done: false,
  },
  {
    title: "مدفوع كام وباقي كام لم يتم دفعه",
    done: true,
  },
  {
    title: "العقار ثم الوحدة ثم معرف الوحدة في جدول الوحدات ",
    done: false,
  },
  {
    title: "اضافة رقم الوحده بدل من معرف الوحده ",
    done: false,
  },
  {
    title: "السماح للمحاسب باضافة تعديلات علي الدفعات ",
    done: false,
  },

  {
    title: "جعل رقم العقار يتم توليده تلقائيا",
    done: true,
  },
  {
    title: "تحويل الحساب الي مالك بدلا من مستاجر",
    done: true,
  },
  {
    title: "تعديل شكل الدفعات ",
    done: true,
  },
  {
    title: "ازاله مصروف العقار واتاحة اضافة مصاريف اخري",
    done: true,
  },
  {
    title: "نموذج طباعة العقد",
    done: true,
  },
  {
    title: "اضافه المتبقي من الدفعه كصف اخر في الدفعات",
    done: true,
  },
  {
    title: " تعديل الدفعه بحيث تكون اقرب ل50 او 100",
    done: true,
  },
  {
    title: "طريقة عرض عقود الايجار ممكن نعملها لكل وحده جدول او شيء",
    done: true,
  },
  {
    title: "قسم الصيانة والذي يضمن تقديم طلبات الصيانة ",
    done: true,
  },
  {
    title: "نقل زر اضافة الوحده داخل العقار الي اسفل الفورم",
    done: true,
  },
  {
    title: "اماره ثم مدينه ثم منطقه ثم حي",
    done: false,
  },
  {
    title: "لما اذهب الي عقار يتم عرض الوحدات الخاصه بهذا العقار",
    done: true,
  },
  {
    title: "قسم الفواتير والذي يضمن متابعة الفواتير",
    done: false,
  },
  {
    title:
      "امكانيه تجديد العقد او الغاءه عند الغاء او التجديد يتم الاحتفاظ بالمعاملات القديمه مع حذف الدفعات التي لم يتم دفعها بعد",
    done: true,
  },
  {
    title: "فواصل للارقام الماليه",
    done: false,
  },
  {
    title: "وضع (-) في ارقام الهويه",
    done: false,
  },
  {
    title: "فورم الوحده والعقار يكون مودل افضل؟",
    done: true,
  },
  {
    title:
      "تقارير العقارات والتي تضمن عدة تقارير مثلا الوحدات المستاجره وغير المستاجره , المستحقات والربح والمصروفات",
    done: true,
  },
  {
    title: "الصفحة الرئيسية ",
    done: true,
  },
  {
    title: "اضافة عقود الايجار التي شارفت علي الانتهاء",
    done: true,
  },
  {
    title: "تعديل القيم الثابته للرسوم",
    done: false,
  },
];

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);

  const sortedTasks = tasks
    .map((task, index) => ({ ...task, index }))
    .sort((a, b) => a.done - b.done || a.index - b.index);

  return (
    <div>
      <h1>المهام</h1>
      <List>
        {sortedTasks.map((task, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={`${task.index + 1}. ${task.title}`}
              style={{ textDecoration: task.done ? "line-through" : "none" }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
