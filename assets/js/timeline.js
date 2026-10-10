/* Action boundaries follow recorded events and the 20 fps video clock. */
window.G1_TIMELINE = {
  "duration": 156.35,
  "phases": [
    {
      "title": "登台与搬运",
      "subtitle": "ARRIVE & CARRY",
      "actions": [
        {
          "label": "自然站立",
          "start": 0,
          "source_event": "initial_stand"
        },
        {
          "label": "迈步登上舞台",
          "start": 1.5,
          "source_event": "stage_entry"
        },
        {
          "label": "走向俯卧撑支架",
          "start": 4.82,
          "source_event": "approach"
        },
        {
          "label": "停步站稳",
          "start": 20.3,
          "source_event": "recover"
        },
        {
          "label": "准备拾取",
          "start": 23.632,
          "source_event": "prepare_grasp"
        },
        {
          "label": "弯腰拾取支架",
          "start": 27.634,
          "source_event": "crouch"
        },
        {
          "label": "双手握紧支架",
          "start": 35.934,
          "source_event": "close_grasp"
        },
        {
          "label": "持架起身",
          "start": 38.232,
          "source_event": "pickup"
        },
        {
          "label": "原地转向舞台中心",
          "start": 46.234,
          "source_event": "turn_center"
        },
        {
          "label": "走向舞台中心",
          "start": 51.09,
          "source_event": "carry_center"
        }
      ],
      "start": 0
    },
    {
      "title": "放置与展示",
      "subtitle": "PLACE & POSE",
      "actions": [
        {
          "label": "停步调整站姿",
          "start": 57.818,
          "source_event": "recover"
        },
        {
          "label": "转向正前方",
          "start": 60.566,
          "source_event": "turn_front"
        },
        {
          "label": "弯腰放置支架",
          "start": 64.468,
          "source_event": "lower"
        },
        {
          "label": "松手离开支架",
          "start": 72.868,
          "source_event": "open"
        },
        {
          "label": "起身自然站立",
          "start": 77.666,
          "source_event": "rise_empty"
        },
        {
          "label": "保持自然站姿",
          "start": 85.668,
          "source_event": "natural_stand"
        },
        {
          "label": "秀肌肉",
          "start": 88.668,
          "source_event": "flex"
        },
        {
          "label": "恢复自然站立",
          "start": 92.668,
          "source_event": "return_natural"
        }
      ],
      "start": 57.818
    },
    {
      "title": "支架俯卧撑",
      "subtitle": "REACH & PUSH UP",
      "actions": [
        {
          "label": "蹲下",
          "start": 99.864,
          "source_event": "crouch"
        },
        {
          "label": "调整双手朝向",
          "start": 108.068,
          "source_event": "orient_open_hands"
        },
        {
          "label": "双臂前伸触架",
          "start": 110.272,
          "source_event": "reach_bars"
        },
        {
          "label": "双手握紧支架",
          "start": 113.276,
          "source_event": "close_grip"
        },
        {
          "label": "稳住支撑姿势",
          "start": 114.98,
          "source_event": "prepare_support"
        },
        {
          "label": "右腿后伸并落稳",
          "start": 118.184,
          "source_event": "right_extend"
        },
        {
          "label": "左腿后伸并落稳",
          "start": 120.088,
          "source_event": "left_extend"
        },
        {
          "label": "曲臂向下",
          "start": 121.992,
          "source_event": "pushup_lower"
        },
        {
          "label": "推起恢复支撑",
          "start": 123.696,
          "source_event": "pushup_raise"
        },
        {
          "label": "收回左腿并落稳",
          "start": 125.4,
          "source_event": "left_return"
        },
        {
          "label": "收回右腿并落稳",
          "start": 127.304,
          "source_event": "right_return"
        },
        {
          "label": "恢复蹲姿",
          "start": 129.208,
          "source_event": "release_crouch"
        },
        {
          "label": "松开双手",
          "start": 132.408,
          "source_event": "open_hands"
        },
        {
          "label": "收回双臂",
          "start": 133.408,
          "source_event": "withdraw_hands"
        },
        {
          "label": "起身站立",
          "start": 136.108,
          "source_event": "stand_up"
        }
      ],
      "start": 99.864
    },
    {
      "title": "跳跃与谢幕",
      "subtitle": "JUMP & FINISH",
      "actions": [
        {
          "label": "站稳准备跳跃",
          "start": 144.308,
          "source_event": "jump"
        },
        {
          "label": "双臂后摆、屈膝",
          "start": 145.808,
          "source": "jump controller: backswing and knee bend begin at +1.5 s"
        },
        {
          "label": "双臂前摆、起身跳跃",
          "start": 147.108,
          "source": "jump controller: extension and forward arm swing begin at +2.8 s"
        },
        {
          "label": "自然落地、恢复站立",
          "start": 147.404,
          "source": "metrics.csv: first foot contact sample after flight, local time 48.744 s"
        },
        {
          "label": "再次秀肌肉",
          "start": 149.708,
          "source_event": "final_flex"
        }
      ],
      "start": 144.308
    }
  ]
};
