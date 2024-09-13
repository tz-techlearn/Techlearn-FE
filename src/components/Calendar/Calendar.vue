<template>
  <ejs-schedule height="750px" width="100%" ref='scheduleObj' :selectedDate="selectedDate" :eventSettings="eventSettings" :actionBegin="onActionBegin"
    class="calendar" :editorTemplate="'editorTemplate'" :eventRendered="onEventRendered" :startHour="startHour" :endHour="endHour"
    :timeScale="timeScale">
    <template v-slot:editorTemplate>
      <table class="custom-event-editor" width="100%" cellpadding="5">
        <tbody>
          <tr>
            <td class="e-textlabel">Tiêu đề</td>
            <td colspan="4">
              <input id="Subject" class="e-field e-input" type="text" value="" name="Subject" style="width: 100%" />
            </td>
          </tr>
          <tr>
            <td class="e-textlabel">Giảng viên</td>
            <td colspan="4">
              <ejsDropdownlist id='OwnerId' name="OwnerId" class="e-field" placeholder='Choose status' :dataSource='ownerDataSource'
                :fields="dropListFields">
              </ejsDropdownlist>
            </td>
          </tr>
          <tr>
            <td class="e-textlabel">Giờ bắt đầu</td>
            <td colspan="4">
              <ejsDatetimepicker id="StartTime" class="e-field" name="StartTime"></ejsDatetimepicker>
            </td>
          </tr>
          <tr>
            <td class="e-textlabel">Giờ kết thúc</td>
            <td colspan="4">
              <ejsDatetimepicker id="EndTime" class="e-field" name="EndTime"></ejsDatetimepicker>
            </td>
          </tr>
          <tr>
            <td class="e-textlabel">Mô tả</td>
            <td colspan="4">
              <textarea id="Description" class="e-field e-input" name="Description" rows="3" cols="50"
                style="width: 100%; height: 60px !important; resize: vertical"></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <e-views>
      <e-view option="Day"></e-view>
      <e-view option="Week"></e-view>
      <e-view option="WorkWeek"></e-view>
      <e-view option="Month"></e-view>
      <e-view option="Agenda"></e-view>
    </e-views>
    <e-resources>
      <e-resource field="OwnerId" title="Owner" name="Owners" :dataSource="ownerDataSource" textField="OwnerText" idField="Id"
        colorField="OwnerColor">
      </e-resource>
    </e-resources>
  </ejs-schedule>
</template>

<script setup>
import { onMounted, provide, ref, nextTick } from "vue";
import {
  ScheduleComponent as EjsSchedule, ViewsDirective as EViews, ViewDirective as EView, ResourcesDirective as EResources, ResourceDirective as EResource,
  Day, Week, WorkWeek, Month, Agenda, DragAndDrop
} from "@syncfusion/ej2-vue-schedule";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import axios from "axios";
import { DropDownListComponent as ejsDropdownlist } from "@syncfusion/ej2-vue-dropdowns";
import { DateTimePickerComponent as ejsDatetimepicker } from "@syncfusion/ej2-vue-calendars";
import { toast } from 'vue3-toastify';
import { watch } from "vue";
import Swal from "sweetalert2";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import viLocale from "../../locale/vi.json";
import { loadCldr } from '@syncfusion/ej2-base';
import frNumberData from '@syncfusion/ej2-cldr-data/main/vi/numbers.json';
import frtimeZoneData from '@syncfusion/ej2-cldr-data/main/vi/timeZoneNames.json';
import frGregorian from '@syncfusion/ej2-cldr-data/main/vi/ca-gregorian.json';
import frNumberingSystem from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';
const rootApi = process.env.VUE_APP_ROOT_API;
const props = defineProps(['url', 'id']);
let timerInterval;

setCulture('vi');
L10n.load(viLocale)
loadCldr(frNumberData, frtimeZoneData, frGregorian, frNumberingSystem);
provide("schedule", [Day, Week, WorkWeek, Month, Agenda, DragAndDrop]);

const remoteData = new DataManager({
  // url: 'http://localhost:3000/dataSource',
  url: `${props.url}`,
  adaptor: new WebApiAdaptor,
  crossDomain: true
});


const scheduleObj = ref(null);
const selectedDate = new Date();
const ownerDataSource = ref([]);
const eventSettings = ref({

  dataSource: remoteData
});

const startHour = "08:00";
const endHour = "21:00";
const timeScale = {
  enable: true,
  interval: 10,
  slotCount: 1
};

const dropListFields = {
  text: "OwnerText",
  value: "Id"
}

const getOwnerDataSource = async () => {
  const res = await axios.get("http://localhost:8181/api/v1/teachers/");
  ownerDataSource.value = res.data;
}


const getEvent = async () => {
  try {
    const res = await axios.get(`${rootApi}/find-by-id/${props.id}`);
    const filtered = res.data.filter((event) => {
      return new Date(event.StartTime) >= new Date();
    })
    console.log(res.data);
    eventSettings.value = {
      dataSource: res.data
    };
  } catch (error) {
    console.error('Error fetching or filtering events:', error);
  }
};
;


const onEventRendered = (args) => {
  const ownerId = args.data.OwnerId;
  if (ownerId) {
    const owner = ownerDataSource.value.find(owner => owner.Id === ownerId);
    if (owner) {
      const avatarHtml = `<div class="mx-1">
                            <img width="24" height="24" src="${owner.avatar}" 
                              class="owner-avatar rounded-circle img-fluid border border-white" />
                          </div>`;

      const eventWidth = args.element.offsetWidth;
      const avatarWidth = 30;
      const availableWidth = eventWidth - avatarWidth - 10;

      let subjectText = args.data.Subject;
      if (subjectText.length > 20) {
        subjectText = subjectText.substring(0, 17) + '...';
      }

      args.element.innerHTML = `
        <div class="d-flex align-items-center h-100 overflow-hidden">
          ${avatarHtml}
          <div class="text-truncate" style="max-width: ${availableWidth}px;">${subjectText}</div>
        </div>`;

      args.element.title = args.data.Subject;
    }
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  // Chuyển đổi sang múi giờ Asia/Bangkok
  date.setHours(date.getHours() + 7);
  // Format date to 'yyyy-MM-ddTHH:mm:ss'
  return date.toISOString().slice(0, 19);
};

const onActionBegin = async (args) => {
  if (args.requestType === 'eventCreate') {
    try {
      const eventData = args.data[0];

      const formattedEventData = {
        ...eventData,
        StartTime: formatDate(eventData.StartTime),
        EndTime: formatDate(eventData.EndTime),
      };
      await axios.post(`${props.url}`, formattedEventData);
      toast.success('Tạo lịch thành công!');
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Bạn phải thêm lịch vào ngày và giờ lớn hơn ngày và giờ hiện tại!');
    }
  } else if (args.requestType === 'eventRemove') {
    try {
      await axios.delete(`${props.url}/${args.data[0].Id}`);
      toast.success('Xóa lịch thành công!');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Không thể xóa sự kiện!');
    }
  } else if (args.requestType === 'eventChange') {
    try {

      let formattedEventData = {
        ...args.data,
        StartTime: formatDate(args.data.StartTime),
        EndTime: formatDate(args.data.EndTime),
      };

      if (props.url.includes('student')) {
        formattedEventData = {
          ...formattedEventData,
          UserId: '4d281145-ef96-4320-b42b-a94463effcdf',
        };
      }

      console.log(formattedEventData);

      await axios.put(`${props.url}/${formattedEventData.Id}`, formattedEventData);
      toast.success('Cập nhật lại lịch thành công!');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Cập nhật lịch thất bại!');
    }
  }
  await nextTick(() => {
    scheduleObj.value.refreshEvents();
  });
}

onMounted(() => {
  getOwnerDataSource()
})

watch(() => props.id, (newId) => {
  if (newId) {
    eventSettings.value = {
      dataSource: props.id,
    };
  }
});
</script>

<style scoped>

@import '../../../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-calendars/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-inputs/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-vue-schedule/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-base/styles/material.css';
</style>